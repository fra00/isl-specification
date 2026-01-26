import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: ".", // Imposta la root nella cartella corrente
  server: {
    open: true, // Apre il browser automaticamente
  },
});
