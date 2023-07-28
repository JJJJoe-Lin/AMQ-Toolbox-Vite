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
                name: 'AMQ Quick Answer(dev)',
                version: '0.4.2',
                description: 'AMQ Quick-Answer Buttons',
                author: 'JJJJoe',
                include: '/^https:\\/\\/animemusicquiz\\.com\\/(\\?.*|#.*)?$/',
                updateURL: 'https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/develop/plugins/quick-answer/script/quick-answer.user.js',
                downloadURL: 'https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/develop/plugins/quick-answer/script/quick-answer.user.js',
            },
            server: {
                open: false,
            }
        }),
    ],
});