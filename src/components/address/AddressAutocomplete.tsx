"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MapPinned } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import type {
    GoongAutocompleteResponse,
    GoongPlaceDetailResponse,
    GoongPrediction,
} from "@/lib/goong-types";
import { resolveAddressFields } from "@/lib/parse-vn-formatted-address";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface ResolvedAddressPayload {
    street: string;
    province: string;
    district: string;
    ward: string;
}

export interface AddressAutocompleteProps {
    sessionToken: string;
    onResolved: (payload: ResolvedAddressPayload) => void;
    disabled?: boolean;
    id?: string;
}

export function AddressAutocomplete({
    sessionToken,
    onResolved,
    disabled,
    id,
}: AddressAutocompleteProps) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [predictions, setPredictions] = useState<GoongPrediction[]>([]);
    const [loading, setLoading] = useState(false);
    const [picking, setPicking] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        const q = query.trim();
        if (q.length < 2) {
            setPredictions([]);
            return;
        }
        debounceRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const qs = new URLSearchParams({
                    input: q,
                    sessiontoken: sessionToken,
                });
                const res = await fetch(`/api/goong/autocomplete?${qs}`);
                const data = (await res.json()) as GoongAutocompleteResponse & {
                    error?: string;
                };
                if (res.ok && Array.isArray(data.predictions)) {
                    setPredictions(data.predictions);
                    setOpen(true);
                } else {
                    setPredictions([]);
                }
            } catch {
                setPredictions([]);
            } finally {
                setLoading(false);
            }
        }, 300);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query, sessionToken]);

    const handlePick = async (pred: GoongPrediction) => {
        setPicking(true);
        try {
            const qs = new URLSearchParams({
                place_id: pred.place_id,
                sessiontoken: sessionToken,
            });
            const res = await fetch(`/api/goong/place-detail?${qs}`);
            const data = (await res.json()) as GoongPlaceDetailResponse & {
                error?: string;
            };

            if (!res.ok) {
                toast.error(
                    data.error ??
                        "Không lấy được chi tiết địa điểm. Thử chọn gợi ý khác.",
                );
                return;
            }

            const result = data.result;
            const formatted = result?.formatted_address;
            const name = result?.name?.trim();
            const mainText =
                pred.structured_formatting?.main_text?.trim() ?? "";

            const { ward, district, province } = resolveAddressFields({
                formattedAddress: formatted,
                compound: pred.compound,
                secondaryText: pred.structured_formatting?.secondary_text,
            });

            const street =
                name ||
                mainText ||
                pred.description.split(",")[0]?.trim() ||
                "";

            onResolved({
                street,
                ward,
                district,
                province,
            });
            setQuery(pred.description);
            setOpen(false);
        } finally {
            setPicking(false);
        }
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="flex items-center gap-2">
                <MapPinned className="size-4 shrink-0 text-muted-foreground" />
                Tìm địa chỉ (Goong)
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger
                    nativeButton={false}
                    className={cn(
                        "block w-full min-w-0 cursor-text text-left",
                        disabled && "pointer-events-none opacity-60",
                    )}
                >
                    <div className="relative">
                        <Input
                            id={id}
                            value={query}
                            disabled={disabled || picking}
                            placeholder="Nhập số nhà, đường, phường…"
                            autoComplete="off"
                            className="min-h-11 bg-background pr-10"
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => {
                                if (predictions.length > 0) setOpen(true);
                            }}
                        />
                        {(loading || picking) && (
                            <Loader2
                                className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
                                aria-hidden
                            />
                        )}
                    </div>
                </PopoverTrigger>
                <PopoverContent
                    className="w-(--anchor-width) min-w-[min(100%,var(--anchor-width))] max-w-[calc(100vw-2rem)] p-0"
                    align="start"
                    sideOffset={4}
                >
                    <Command shouldFilter={false}>
                        <CommandList>
                            <CommandEmpty className="py-4 text-xs text-muted-foreground">
                                {query.trim().length < 2
                                    ? "Nhập ít nhất 2 ký tự."
                                    : loading
                                      ? "Đang tìm…"
                                      : "Không có gợi ý. Thử từ khóa khác."}
                            </CommandEmpty>
                            {predictions.length > 0 && (
                                <CommandGroup heading="Gợi ý">
                                    {predictions.map((p) => (
                                        <CommandItem
                                            key={p.place_id}
                                            value={p.place_id}
                                            onSelect={() => {
                                                void handlePick(p);
                                            }}
                                            className="cursor-pointer flex-col items-start gap-0.5 py-2"
                                        >
                                            <span className="font-medium">
                                                {p.structured_formatting
                                                    ?.main_text ??
                                                    p.description}
                                            </span>
                                            {p.structured_formatting
                                                ?.secondary_text && (
                                                <span className="text-xs text-muted-foreground">
                                                    {
                                                        p.structured_formatting
                                                            .secondary_text
                                                    }
                                                </span>
                                            )}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
                Chọn một gợi ý để điền tự động theo địa giới hành chính hiện
                hành. Bạn vẫn có thể chỉnh tay các ô bên dưới.
            </p>
        </div>
    );
}
