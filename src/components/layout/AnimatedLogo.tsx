import type { ComponentPropsWithoutRef } from "react";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

type AnimatedLogoProps = ComponentPropsWithoutRef<"span"> & {
    showText?: boolean;
    inverse?: boolean;
    textClassName?: string;
};

export default function AnimatedLogo({
    className,
    showText = true,
    inverse = false,
    textClassName,
    ...props
}: AnimatedLogoProps) {
    return (
        <span
            aria-label={SITE_NAME}
            className={cn(
                "animated-logo inline-flex min-w-0 items-center",
                inverse && "animated-logo--inverse",
                !showText && "animated-logo--mark",
                className,
            )}
            {...props}
        >
            <span className="animated-logo__wordmark">
                <span
                    className="animated-logo__bar animated-logo__bar--top"
                    aria-hidden="true"
                />
                <span
                    className="animated-logo__bar animated-logo__bar--left"
                    aria-hidden="true"
                />
                <span
                    className={cn(
                        "animated-logo__title",
                        showText ? "text-xl md:text-2xl" : "text-xl",
                        textClassName,
                    )}
                    data-text={showText ? SITE_NAME : SITE_NAME.slice(0, 1)}
                    aria-hidden={!showText}
                >
                    {showText ? SITE_NAME : SITE_NAME.slice(0, 1)}
                </span>
                <span
                    className="animated-logo__bar animated-logo__bar--bottom"
                    aria-hidden="true"
                />
                <span
                    className="animated-logo__bar animated-logo__bar--right"
                    aria-hidden="true"
                />
            </span>
        </span>
    );
}
