import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcsvite from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcsvite()],
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});
