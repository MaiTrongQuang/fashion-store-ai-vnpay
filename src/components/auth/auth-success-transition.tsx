"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

type AuthMotionSurfaceProps = {
    children: React.ReactNode;
    className?: string;
    /** Khi true: chạy animation thoát rồi gọi onExitComplete một lần */
    exit: boolean;
    onExitComplete: () => void;
};

/**
 * Bọc form đăng nhập / đăng ký: vào trang mượt, thoát mượt trước khi router.push.
 * Tôn trọng prefers-reduced-motion: bỏ animation thoát, gọi onExitComplete ngay.
 */
export function AuthMotionSurface({
    children,
    className,
    exit,
    onExitComplete,
}: AuthMotionSurfaceProps) {
    const reduced = useReducedMotion();
    const completedRef = useRef(false);
    const onExitCompleteRef = useRef(onExitComplete);

    useEffect(() => {
        onExitCompleteRef.current = onExitComplete;
    }, [onExitComplete]);

    useEffect(() => {
        if (!reduced || !exit || completedRef.current) return;
        completedRef.current = true;
        onExitCompleteRef.current();
    }, [reduced, exit]);

    if (reduced) {
        return (
            <div className={cn("relative z-10 w-full max-w-md", className)}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            className={cn("relative z-10 w-full max-w-md", className)}
            initial={{ opacity: 0, y: 22 }}
            animate={
                exit
                    ? {
                          opacity: 0,
                          y: -18,
                          scale: 0.97,
                          filter: "blur(5px)",
                      }
                    : {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          filter: "blur(0px)",
                      }
            }
            transition={{ duration: 0.42, ease }}
            onAnimationComplete={() => {
                if (!exit || completedRef.current) return;
                completedRef.current = true;
                onExitCompleteRef.current();
            }}
        >
            {children}
        </motion.div>
    );
}
