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
                name: 'AMQ Force Skip',
                version: '0.2.0',
                description: 'Skip song without waiting buffering',
                author: 'JJJJoe',
                match: 'https://animemusicquiz.com/*',
            },
        }),
    ],
});