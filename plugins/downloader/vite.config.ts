import { defineConfig } from 'vite';
import monkeyPlugin from 'vite-plugin-monkey';

export default defineConfig({
    build: {
        outDir: './script',
    },
    plugins: [
        monkeyPlugin({
            entry: 'src/main.ts',
            userscript: {
                namespace: 'https://github.com/JJJJoe-Lin',
                name: 'AMQ Downloader',
                version: '0.2.0',
                description: 'AMQ song downloader',
                author: 'JJJJoe',
                match: 'https://animemusicquiz.com/*',
            },
        }),
    ],
});