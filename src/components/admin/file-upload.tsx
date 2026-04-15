"use client";

import { useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Image as ImageIcon, Film, Link2 } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
    value?: string;
    onChange: (url: string) => void;
    accept?: string;
    bucket?: string;
    folder?: string;
    label?: string;
    /** Show a URL text input as fallback */
    showUrlInput?: boolean;
}

export function FileUpload({
    value = "",
    onChange,
    accept = "image/*,video/*",
    bucket = "media",
    folder = "uploads",
    label = "Tải lên hình ảnh / video",
    showUrlInput = true,
}: FileUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string>(value);
    const [dragOver, setDragOver] = useState(false);
    const [mode, setMode] = useState<"upload" | "url">(value ? "url" : "upload");
    const inputRef = useRef<HTMLInputElement>(null);

    const isVideo = (url: string) =>
        /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url) || url.includes("video");

    const uploadFile = useCallback(
        async (file: File) => {
            if (!file) return;

            // Validate file size (50MB max)
            if (file.size > 52428800) {
                toast.error("File quá lớn. Tối đa 50MB.");
                return;
            }

            setUploading(true);
            try {
                const supabase = createClient();
                const ext = file.name.split(".").pop();
                const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

                const { error: uploadError } = await supabase.storage
                    .from(bucket)
                    .upload(fileName, file, {
                        cacheControl: "3600",
                        upsert: false,
                    });

                if (uploadError) throw uploadError;

                const {
                    data: { publicUrl },
                } = supabase.storage.from(bucket).getPublicUrl(fileName);

                setPreview(publicUrl);
                onChange(publicUrl);
                toast.success("Tải lên thành công!");
            } catch (err: any) {
                console.error("Upload error:", err);
                toast.error(err.message || "Lỗi tải file lên");
            } finally {
                setUploading(false);
            }
        },
        [bucket, folder, onChange]
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) uploadFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) uploadFile(file);
    };

    const handleRemove = () => {
        setPreview("");
        onChange("");
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">{label}</span>
                {showUrlInput && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs h-6 px-2"
                        onClick={() => setMode(mode === "upload" ? "url" : "upload")}
                    >
                        {mode === "upload" ? (
                            <>
                                <Link2 className="h-3 w-3 mr-1" />
                                Dùng URL
                            </>
                        ) : (
                            <>
                                <Upload className="h-3 w-3 mr-1" />
                                Tải file
                            </>
                        )}
                    </Button>
                )}
            </div>

            {mode === "url" ? (
                <Input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={preview}
                    onChange={(e) => {
                        setPreview(e.target.value);
                        onChange(e.target.value);
                    }}
                />
            ) : (
                <div
                    className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
                        dragOver
                            ? "border-primary bg-primary/5"
                            : "border-muted-foreground/25 hover:border-primary/50"
                    }`}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept={accept}
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />

                    {uploading ? (
                        <div className="py-4 flex flex-col items-center gap-2 text-muted-foreground">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            <span className="text-sm">Đang tải lên...</span>
                        </div>
                    ) : (
                        <div className="py-4 flex flex-col items-center gap-2 text-muted-foreground">
                            <Upload className="h-8 w-8" />
                            <span className="text-sm">
                                Kéo thả hoặc click để chọn file
                            </span>
                            <span className="text-xs">
                                Ảnh (JPG, PNG, WebP) hoặc Video (MP4, WebM) — Tối đa 50MB
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Preview */}
            {preview && (
                <div className="relative inline-block mt-2">
                    {isVideo(preview) ? (
                        <div className="relative">
                            <video
                                src={preview}
                                className="w-32 h-24 object-cover rounded-lg border"
                                muted
                                loop
                                autoPlay
                                playsInline
                            />
                            <Film className="absolute top-1 left-1 h-4 w-4 text-white drop-shadow" />
                        </div>
                    ) : (
                        <div className="relative">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-32 h-24 object-cover rounded-lg border"
                                onError={() => {}}
                            />
                            <ImageIcon className="absolute top-1 left-1 h-4 w-4 text-white drop-shadow" />
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRemove();
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </div>
            )}
        </div>
    );
}
