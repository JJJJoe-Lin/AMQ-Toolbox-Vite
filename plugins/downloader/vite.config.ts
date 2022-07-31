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
                version: '0.2.5',
                description: 'AMQ song downloader',
                author: 'JJJJoe',
                include: '/^https:\\/\\/animemusicquiz\\.com\\/(\\?.*|#.*)?$/',
                updateURL: 'https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/master/plugins/downloader/script/downloader.user.js',
                downloadURL: 'https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/master/plugins/downloader/script/downloader.user.js',
                connect: 'cdn.animenewsnetwork.com',
            },
            build: {
                externalGlobals: {
                    mp3tag: ['mp3tag', (version) => `https://cdn.jsdelivr.net/npm/mp3tag.js@${version}/dist/mp3tag.min.js`],
                }
            }
        }),
    ],
});