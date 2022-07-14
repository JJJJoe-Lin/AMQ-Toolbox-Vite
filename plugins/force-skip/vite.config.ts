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
                version: '0.2.1',
                description: 'Skip song without waiting buffering',
                author: 'JJJJoe',
                match: 'https://animemusicquiz.com/*',
                updateURL: 'https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/master/plugins/force-skip/script/force-skip.user.js',
            },
        }),
    ],
});