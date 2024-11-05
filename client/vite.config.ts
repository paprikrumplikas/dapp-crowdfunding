import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
  },
  build: {
    // ... other build options ...
    copyPublicDir: true,
  },
});