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
                name: 'AMQ No Avatar Snipe',
                version: '0.2.0',
                description: 'Avatar would not change when players answered',
                author: 'JJJJoe',
                match: 'https://animemusicquiz.com/*',
            },
        }),
    ],
});