import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import type { Review } from "@/lib/types";

interface ProductReviewsProps {
    reviews: Review[];
    avgRating: number;
}

export default function ProductReviews({
    reviews,
    avgRating,
}: ProductReviewsProps) {
    return (
        <section className="mt-16">
            <h2 className="text-xl font-bold mb-6">
                Đánh Giá ({reviews.length})
            </h2>

            {reviews.length === 0 ? (
                <div className="text-center py-12 bg-accent/30 rounded-2xl">
                    <p className="text-muted-foreground">
                        Chưa có đánh giá nào cho sản phẩm này
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Rating Summary */}
                    <div className="flex items-center gap-6 p-6 bg-accent/30 rounded-2xl">
                        <div className="text-center">
                            <p className="text-4xl font-bold">
                                {avgRating.toFixed(1)}
                            </p>
                            <div className="flex mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`h-4 w-4 ${
                                            star <= Math.round(avgRating)
                                                ? "fill-amber-400 text-amber-400"
                                                : "text-muted"
                                        }`}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                {reviews.length} đánh giá
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Review List */}
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="flex gap-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                        {(
                                            review.profile as {
                                                full_name?: string;
                                            }
                                        )?.full_name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-sm">
                                            {(
                                                review.profile as {
                                                    full_name?: string;
                                                }
                                            )?.full_name || "Khách hàng"}
                                        </p>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDate(review.created_at)}
                                        </span>
                                    </div>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-3.5 w-3.5 ${
                                                    star <= review.rating
                                                        ? "fill-amber-400 text-amber-400"
                                                        : "text-muted"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    {review.comment && (
                                        <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                                            {review.comment}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
