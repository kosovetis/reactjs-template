import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
export default defineConfig({
  base: "./",          // ← ключевая строка!
  resolve: {
  dedupe: ["react", "react-dom"],
  alias: {
    react: resolve(__dirname, "node_modules/react"),
    "react-dom": resolve(__dirname, "node_modules/react-dom")
  }
},
});
