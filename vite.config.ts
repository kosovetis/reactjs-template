import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",          // ← ключевая строка!
  resolve: { dedupe: ["react", "react-dom"] },
  plugins: [react()],
});
