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
                version: '0.3.0',
                description: 'AMQ song downloader',
                author: 'JJJJoe',
                include: '/^https:\\/\\/animemusicquiz\\.com\\/(\\?.*|#.*)?$/',
                updateURL: 'https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/master/plugins/downloader/script/downloader.user.js',
                downloadURL: 'https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/master/plugins/downloader/script/downloader.user.js',
                connect: 'cdn.animenewsnetwork.com',
            },
            build: {
                externalGlobals: {
                    mp3tag: ['mp3tag', `https://cdn.jsdelivr.net/npm/mp3tag.js@3.3.0/dist/mp3tag.min.js`],
                }
            },
            server: {
                open: false,
            },
        }),
    ],
});