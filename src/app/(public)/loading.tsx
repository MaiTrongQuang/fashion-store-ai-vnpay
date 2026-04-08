export default function HomeLoading() {
    return (
        <div className="flex flex-col animate-pulse">
            {/* Hero Banner Skeleton */}
            <section className="relative w-full h-[70vh] min-h-[500px] bg-muted/40">
                <div className="absolute inset-0 bg-gradient-to-r from-muted/60 to-transparent" />
                <div className="container mx-auto px-4 relative z-10 flex flex-col justify-center h-full max-w-2xl gap-4">
                    <div className="h-5 w-32 rounded-full bg-muted/80" />
                    <div className="h-12 w-3/4 rounded-2xl bg-muted/80" />
                    <div className="h-12 w-1/2 rounded-2xl bg-muted/80" />
                    <div className="h-5 w-2/3 rounded-full bg-muted/60 mt-2" />
                    <div className="flex gap-4 mt-6">
                        <div className="h-12 w-40 rounded-full bg-muted/80" />
                        <div className="h-12 w-36 rounded-full bg-muted/60" />
                    </div>
                </div>
            </section>

            {/* Category Grid Skeleton */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12 space-y-3">
                        <div className="h-6 w-32 rounded-full bg-muted/60 mx-auto" />
                        <div className="h-10 w-64 rounded-2xl bg-muted/60 mx-auto" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="aspect-4/5 rounded-[2rem] bg-muted/40"
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Flash Sale Skeleton */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
                        <div className="space-y-3">
                            <div className="h-8 w-28 rounded-full bg-red-500/10" />
                            <div className="h-12 w-72 rounded-2xl bg-muted/60" />
                            <div className="h-5 w-96 rounded-full bg-muted/40" />
                        </div>
                        <div className="flex gap-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-14 w-14 rounded-lg bg-muted/60"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <ProductSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products Skeleton */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-start justify-between mb-12 gap-6">
                        <div className="space-y-3">
                            <div className="h-8 w-40 rounded-full bg-primary/10" />
                            <div className="h-12 w-64 rounded-2xl bg-muted/60" />
                            <div className="h-5 w-80 rounded-full bg-muted/40" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <ProductSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

function ProductSkeleton() {
    return (
        <div className="rounded-xl border border-border/50 overflow-hidden bg-card animate-pulse">
            <div className="aspect-3/4 bg-muted/50" />
            <div className="p-4 space-y-3">
                <div className="h-3 bg-muted rounded-full w-1/3" />
                <div className="h-4 bg-muted rounded-full w-3/4" />
                <div className="flex gap-2">
                    <div className="h-5 bg-muted rounded-full w-1/3" />
                    <div className="h-5 bg-muted rounded-full w-1/4" />
                </div>
            </div>
        </div>
    );
}
