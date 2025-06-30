import { defineConfig } from "vite";
import eslintPlugin from "vite-plugin-eslint"; // 引入 ESLint 插件
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslintPlugin(), // 在 Vite 中启用 ESLint 插件
  ],
});
