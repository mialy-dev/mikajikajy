
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const frontendNodeModules = resolve(__dirname, "node_modules");

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: [
      {
        find: /^react$/,
        replacement: resolve(frontendNodeModules, "react"),
      },
      {
        find: /^react\/(.*)$/,
        replacement: resolve(frontendNodeModules, "react") + "/$1",
      },
      {
        find: /^react-dom$/,
        replacement: resolve(frontendNodeModules, "react-dom"),
      },
      {
        find: /^react-dom\/(.*)$/,
        replacement: resolve(frontendNodeModules, "react-dom") + "/$1",
      },
    ],
    dedupe: ["react", "react-dom"],
  },
});

