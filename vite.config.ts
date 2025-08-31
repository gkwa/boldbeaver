import { defineConfig } from "vite"
import checker from "vite-plugin-checker"

export default defineConfig({
  plugins: [
    checker({
      typescript: true,
    }),
  ],
  build: {
    sourcemap: true,
    target: "es2020",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
})
