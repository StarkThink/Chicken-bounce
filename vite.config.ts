import { defineConfig } from "vite";
import fs from 'fs';
import path from 'path';
import wasm from "vite-plugin-wasm";
import react from "@vitejs/plugin-react";
import topLevelAwait from "vite-plugin-top-level-await";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), wasm(), topLevelAwait()],
    server: {
        https: {
          key: fs.readFileSync(path.resolve(__dirname, 'localhost+2-key.pem')),
          cert: fs.readFileSync(path.resolve(__dirname, 'localhost+2.pem')),
        },
      },
});
