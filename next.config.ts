import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "*.supabase.co",
            },
            {
                protocol: "https",
                hostname: "*.supabase.in",
            },
        ],
    },
    experimental: {
        // Cache client-side navigations to avoid re-fetching on back/forward
        staleTimes: {
            dynamic: 300, // 5 minutes for dynamic pages
            static: 180, // 3 minutes for static pages
        },
        // Tree-shake large icon & animation libraries for smaller bundles
        optimizePackageImports: [
            "lucide-react",
            "framer-motion",
            "recharts",
            "date-fns",
            "@supabase/supabase-js",
        ],
    },
};

export default nextConfig;
