# AMQ-Toolbox-Vite

This is modularized project of [JJJJoe-Lin/AMQ-Toolbox](https://github.com/JJJJoe-Lin/AMQ-Toolbox). The origin project might not maintain anymore.

> Before install these scripts, please install Tampermonkey browser extension first.

## Plugins
### [Downloader (downloader.user.js)](https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/master/plugins/downloader/script/downloader.user.js)
Download audio/video file of the question. You can use auto download to download each song you met.

### [Quick Answer (quick-answer.user.js)](https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/master/plugins/quick-answer/script/quick-answer.user.js)
Customized buttons for answering quickly.

### [Force Skip (force-skip.user.js)](https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/master/plugins/force-skip/script/force-skip.user.js)
Force skip the answer phase without waiting buffering. Notice: you may not hear the next song where loading is not completed.

### [No Avatar Snipe (no-avatar-snipe.user.js)](https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/master/plugins/no-avatar-snipe/script/no-avatar-snipe.user.js)
Players' avatar wouldn't change when they answered so you can't snipe by that. Notice: other scripts may change this behavior.

### [List Merging (list-merging.user.js)](https://raw.githubusercontent.com/JJJJoe-Lin/AMQ-Toolbox-Vite/master/plugins/list-merging/script/list-merging.user.js)
It can merge any public anime lists to one list.
* Support MAL, AniList, and Kitsu
* When use Kitsu, please use user ID instead of username.
* If there are NSFW entries in Kitsu to be merged, please login with account that allows adult content first.
* ❗ Merging would **not** keep information of merged entries.
* ❗ All entries of target list would be overwrite.

#### Known issue
* Merging to MAL account would got failed sometimes after overwrote and imported too many entries.

## Build
You can build the plugins on your own. Before start, ensure that you have installed node.js 18 and npm 9 on your system.  

After `git clone` this repo, use the command below to build the plugin:

```shell
cd ./AMQ-Toolbox-Vite
npm run pre-build
npm -w <plugin-folderName> run build
```

If you want to create a new plugin with this library, see [Guide (Tradionnal Chinese)](./docs/Guide_zh.md) for more imformation.