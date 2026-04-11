"use client";

import * as React from "react";
import type { TooltipValueType } from "recharts";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    getPayloadConfigFromPayload,
    useChart,
    type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

type TooltipNameType = number | string;

type TooltipPayloadItem = NonNullable<
    React.ComponentProps<typeof ChartTooltipContent>["payload"]
>[number];

export type AdminChartTooltipProps = React.ComponentProps<
    typeof ChartTooltipContent
> & {
    /** Formats the value cell; keeps default shadcn row (indicator + label). */
    valueFormatter?: (
        value: TooltipValueType | undefined,
        name: TooltipNameType | undefined
    ) => React.ReactNode;
};

/**
 * Admin charts: shadcn/ui default chart tooltip ({@link ChartTooltipContent}).
 * Must be used inside {@link ChartContainer}.
 *
 * @see https://www.shadcn.io/patterns/chart-tooltip-default
 */
export function AdminChartTooltip({
    valueFormatter,
    formatter,
    indicator = "dot",
    hideIndicator = false,
    className,
    nameKey,
    color,
    ...props
}: AdminChartTooltipProps) {
    const { config } = useChart();

    const mergedFormatter = React.useMemo(() => {
        if (formatter) return formatter;
        if (!valueFormatter) return undefined;

        return (
            value: TooltipValueType | undefined,
            name: TooltipNameType | undefined,
            item: TooltipPayloadItem,
            _index: number,
            _payload: unknown
        ) => {
            const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`;
            const itemConfig = getPayloadConfigFromPayload(
                config,
                item,
                key
            );
            const indicatorColor =
                color ?? item.payload?.fill ?? item.color;
            const labelText = itemConfig?.label ?? item.name;

            return (
                <>
                    {!hideIndicator &&
                        (itemConfig?.icon ? (
                            <itemConfig.icon />
                        ) : (
                            <div
                                className={cn(
                                    "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                                    {
                                        "h-2.5 w-2.5": indicator === "dot",
                                        "w-1": indicator === "line",
                                        "w-0 border-[1.5px] border-dashed bg-transparent":
                                            indicator === "dashed",
                                    }
                                )}
                                style={
                                    {
                                        "--color-bg": indicatorColor,
                                        "--color-border": indicatorColor,
                                    } as React.CSSProperties
                                }
                            />
                        ))}
                    <div
                        className={cn(
                            "flex flex-1 justify-between leading-none",
                            "items-center"
                        )}
                    >
                        <div className="grid gap-1.5">
                            <span className="text-muted-foreground">
                                {labelText}
                            </span>
                        </div>
                        {item.value != null && (
                            <span className="font-mono font-medium text-foreground tabular-nums">
                                {valueFormatter(value, name)}
                            </span>
                        )}
                    </div>
                </>
            );
        };
    }, [
        color,
        config,
        formatter,
        hideIndicator,
        indicator,
        nameKey,
        valueFormatter,
    ]);

    return (
        <ChartTooltipContent
            indicator={indicator}
            hideIndicator={hideIndicator}
            className={className}
            nameKey={nameKey}
            color={color}
            {...props}
            formatter={
                mergedFormatter as React.ComponentProps<
                    typeof ChartTooltipContent
                >["formatter"]
            }
        />
    );
}

export { ChartContainer, ChartTooltip, ChartTooltipContent };
export type { ChartConfig };
