export default function NamLoading() {
    return (
        <div className="relative animate-pulse">
            {/* Hero Skeleton — gradient xanh dương */}
            <section className="border-b border-border/40 bg-gradient-to-br from-blue-50/60 via-slate-50/40 to-background dark:from-blue-950/20 dark:via-slate-950/10 dark:to-background">
                <div className="container mx-auto px-4 py-10 md:py-14">
                    <div className="mb-6 flex items-center gap-2">
                        <div className="h-4 w-16 rounded bg-muted/60" />
                        <div className="h-4 w-4 rounded bg-muted/40" />
                        <div className="h-4 w-28 rounded bg-muted/60" />
                    </div>
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-2xl space-y-3">
                            <div className="h-7 w-36 rounded-full bg-blue-500/10" />
                            <div className="h-12 w-64 rounded-2xl bg-muted/60" />
                            <div className="h-5 w-80 rounded-full bg-muted/40" />
                        </div>
                        <div className="h-10 w-32 rounded-full bg-muted/50" />
                    </div>
                </div>
            </section>

            {/* Content */}
            <div className="container mx-auto px-4 py-8 md:py-10 lg:py-12">
                <div className="flex flex-col gap-8 lg:flex-row lg:gap-10 xl:gap-12">
                    <aside className="w-full shrink-0 lg:w-72 lg:max-w-[20rem]">
                        <div className="rounded-2xl border border-border/60 bg-card/50 p-5 space-y-6">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="h-5 w-24 rounded bg-muted/70" />
                                    <div className="space-y-2">
                                        {Array.from({ length: 3 }).map(
                                            (_, j) => (
                                                <div
                                                    key={j}
                                                    className="h-4 rounded bg-muted/50"
                                                    style={{
                                                        width: `${70 - j * 15}%`,
                                                    }}
                                                />
                                            ),
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>

                    <div className="min-w-0 flex-1">
                        <div className="mb-6 flex flex-wrap gap-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-11 rounded-full bg-muted/50"
                                    style={{ width: `${80 + i * 10}px` }}
                                />
                            ))}
                        </div>
                        <div className="mb-6 border-b border-border/60 pb-6">
                            <div className="h-4 w-48 rounded bg-muted/50" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="rounded-xl border border-border/50 overflow-hidden bg-card"
                                >
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
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
