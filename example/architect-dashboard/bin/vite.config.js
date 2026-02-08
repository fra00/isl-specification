import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: ".", // Imposta la root nella cartella corrente
  server: {
    open: true, // Apre il browser automaticamente
  },
  test: {
    globals: true,
    environment: "happy-dom", // Lighter than jsdom, better for logic tests
    setupFiles: "./setupTests.js",
    include: ["test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
});
