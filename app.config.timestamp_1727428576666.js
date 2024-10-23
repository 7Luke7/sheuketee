// app.config.js
import { defineConfig } from "@solidjs/start/config";
import { vite as solidVite } from "solid-start";
var app_config_default = defineConfig({
  vite({ router }) {
    const plugins = [];
    if (router === "server") {
    } else if (router === "client") {
    } else if (router === "server-function") {
    }
    plugins.push(solidVite());
    return {
      plugins,
      // Return the array of plugins
      // You can also add other Vite options here
      build: {
        sourcemap: true
        // Enable source maps for better debugging
      }
    };
  }
});
export {
  app_config_default as default
};
