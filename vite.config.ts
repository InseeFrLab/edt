import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svgr(),
        react(),
        nodePolyfills(),
        VitePWA({
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
});
