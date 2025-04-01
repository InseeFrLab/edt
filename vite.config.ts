import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    // @ts-expect-error Test is only for vitest
    test: {
        environment: "jsdom",
    },
    plugins: [
        svgr(),
        react(),
        nodePolyfills(),
        VitePWA({
            includeAssets: ["assets/fonts/marianne-regular-webfont.woff", "assets/illustration/*.png"],
            workbox: {
                maximumFileSizeToCacheInBytes: 15_000_000,
                sourcemap: true,
            },
            registerType: "prompt",
        }),
    ],
    server: {
        port: 3000,
    },
    build: {
        minify: false,
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler",
            },
        },
    },
    resolve: {
        dedupe: [
            "@mui/material",
            "@mui/styles",
            "@mui/utils",
            "@emotion/react",
            "react",
            "react-dom",
            "@inseefr/lunatic",
        ],
    },
});
