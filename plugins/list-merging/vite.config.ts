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
                name: 'AMQ List Merging',
                version: '0.1.1',
                description: 'Merge multiple list to one',
                author: 'JJJJoe',
                include: [
                    '/^https:\\/\\/animemusicquiz\\.com\\/(\\?.*|#.*)?$/',
                    'https://animemusicquiz.com/amqToolbox/oauth2?*',
                ],
                connect: [
                    'myanimelist.net',
                    'anilist.co',
                    'kitsu.io',
                ],
                updateURL: 'https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/master/plugins/list-merging/script/list-merging.user.js',
                downloadURL: 'https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/master/plugins/list-merging/script/list-merging.user.js',
            },
            server: {
                open: false,
            },
        }),
    ],
});