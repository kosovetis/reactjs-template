import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), tsconfigPaths()],
  // Добавляем пустой объект postcss, чтобы переопределить
  // любую автоматическую конфигурацию и отключить Tailwind.
  css: {
    postcss: {}
  },
  resolve: {
    alias: {
    },
  },
});