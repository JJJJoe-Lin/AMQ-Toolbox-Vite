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
                version: '0.4.0',
                description: 'Avatar would not change when players answered',
                author: 'JJJJoe',
                include: '/^https:\\/\\/animemusicquiz\\.com\\/(\\?.*|#.*)?$/',
                updateURL: 'https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/master/plugins/no-avatar-snipe/script/no-avatar-snipe.user.js',
                downloadURL: 'https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/master/plugins/no-avatar-snipe/script/no-avatar-snipe.user.js',
            },
            server: {
                open: false,
            }
        }),
    ],
});