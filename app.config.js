import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  optimizeDeps: {
    exclude: ['js-big-decimal']
  },
  vite({ router }) {
    if (router === "server") {
      // You might want to add server-specific configurations here
      return {
        server: {
          port: 3000, // specify your port if needed
        },
      };
    } else if (router === "client") {
      // Client-specific settings
    } else if (router === "server-function") {
      // Server function-specific settings
    }
    return { plugins: [] };
  },
  ssr: true
})