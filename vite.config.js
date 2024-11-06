import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import * as path from 'path';
import fs from 'fs';
// https://vite.dev/config/
import { fileURLToPath } from 'node:url';
var __dirname = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        https: {
            key: fs.readFileSync("".concat(__dirname, "/cert/key.pem")),
            cert: fs.readFileSync("".concat(__dirname, "/cert/cert.pem"))
        },
        proxy: {}
    }
});
