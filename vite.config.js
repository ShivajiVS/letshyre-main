import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve("src"),
      "@components": path.resolve("src/components"),
      "@pages": path.resolve("src/pages"),
      "@router": path.resolve("src/router"),
      "@hooks": path.resolve("src/hooks"),
      "@utils": path.resolve("src/utils"),
      "@services": path.resolve("src/services"),
      "@assets": path.resolve("src/assets"),
      "@schemas": path.resolve("src/schemas"),
    },
  },

  server: {
    proxy: {
      "/api": {
        target: "https://api.letshyre.com",
        changeOrigin: true,
        secure: true,

        rewrite: (path) => path.replace(/^\/api/, ""),

        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            console.log("Proxying request...");
          });
        },
      },
    },
  },
});
