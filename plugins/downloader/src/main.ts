import {
    Button,
    Buttons,
    CheckboxOption,
    IPlugin,
    onStartPageLoaded,
    Options,
    RadioOption,
    registerPlugin,
} from 'amq-toolbox';
import { getAnimeImage, Image } from './cover';
import MP3Tag from 'mp3tag.js';

declare var Listener: any;
declare var quiz: any;
declare var selfName: any;

interface Mp3Info {
    animeName: string;
    songName: string;
    type: string;
    artist: string;
    annId: number;
    cover: Image | null;
    videoUrl: {
        'catbox_480'?: string;
        'catbox_720'?: string;
        'openingsmoe'?: string;
    }
}

type MediaType = 'Audio' | 'Video';

const CatboxUrlPrefix = 'https://files.catbox.moe/';

class Downloader implements IPlugin {
    public name = 'Downloader';
    public options;
    public view;
    private _enabled = false;
    private currentSongInfo: any;
    private isAutoDlRunning: boolean;
    private answerResultListener: any;

    constructor() {
        this.isAutoDlRunning = false;
        // create options
        this.options = new Options({
            title: this.name,
        });
        this.options.push(new CheckboxOption({
            name: 'autoDlOnWrong',
            inputId: 'amqtbDownloaderAutoDlOnWrong',
            label: 'Auto download only on wrong',
            offset: 0,
            saveIn: 'Script',
        }));
        this.options.push(new CheckboxOption({
            name: 'autoDlMedia',
            inputId: 'amqtbDownloaderAutoDlMedia',
            label: 'Auto download media',
            offset: 0,
            saveIn: 'Script',
            enables: {
                'true': ['autoDlMediaType'],
                'false': [],
            },
        }));
        this.options.push(new RadioOption<MediaType>({
            name: 'autoDlMediaType',
            inputId: 'amqtbDownloaderAutoDlMediaType',
            label: 'Media Type',
            saveIn: 'Script',
            offset: 0,
            choices: [
                {
                    label: 'Audio',
                    value: 'Audio',
                },
                {
                    label: 'Video',
                    value: 'Video',
                },
            ],
        }));
        this.options.push(new CheckboxOption({
            name: 'autoDlInfo',
            inputId: 'amqtbDownloaderAutoDlInfo',
            label: 'Auto download info',
            offset: 0,
            saveIn: 'Script',
        }));
        // create view
        this.view = new Buttons({});
        const autoDlBtn = new Button({
            name: 'autoDlBtn',
            label: 'Start AutoDL',
            size: 'extra-small',
            style: 'success',
        });
        const videoDlBtn = new Button({
            name: 'videoDlBtn',
            label: 'Video',
            size: 'extra-small',
            style: 'primary',
        });
        const audioDlBtn = new Button({
            name: 'audioDlBtn',
            label: 'Audio',
            size: 'extra-small',
            style: 'primary',
        });
        const infoDlBtn = new Button({
            name: 'infoDlBtn',
            label: 'Info',
            size: 'extra-small',
            style: 'primary',
        });
        autoDlBtn.self.on('click', () => {
            this.isAutoDlRunning = !this.isAutoDlRunning;
            if (this.isAutoDlRunning) {
                autoDlBtn.label = 'Stop AutoDL';
                autoDlBtn.style = 'danger';
            } else {
                autoDlBtn.label = 'Start AutoDL';
                autoDlBtn.style = 'success';
            }
        });
        videoDlBtn.self.on('click', () => {
            if (videoDlBtn.self.data("url") !== undefined) {
                this.downloadSongData(videoDlBtn.self.data("url"), !this.isAutoDlRunning);
            }
        });
        audioDlBtn.self.on('click', () => {
            if (audioDlBtn.self.data("url") !== undefined) {
                this.downloadSongData(audioDlBtn.self.data("url"), !this.isAutoDlRunning);
            }
        });
        infoDlBtn.self.on('click', () => {
            this.downloadSongInfo();
        });
        this.view.push(autoDlBtn, videoDlBtn, audioDlBtn, infoDlBtn);

        this.answerResultListener = new Listener("answer results", this.answerResultHanler.bind(this));
        this.enable();
    }

    enable(): void {
        if (!this._enabled) {
            this._enabled = true;
            this.answerResultListener.bindListener();
        }
    }

    disable(): void {
        if (this._enabled) {
            this._enabled = false;
            this.answerResultListener.unbindListener();
        }
    }

    enabled(): boolean {
        return this._enabled;
    }

    private answerResultHanler(result: any) {
        this.currentSongInfo = result.songInfo;
        const resolutions = ["720", "480"];
        const videoDlBtn = this.view.get('videoDlBtn')!;
        const audioDlBtn = this.view.get('audioDlBtn')!;
        const infoDlBtn = this.view.get('infoDlBtn')!;
        // update video URL
        videoDlBtn.self.removeData("url").addClass("disabled");
        for (let resolution of resolutions) {
            let videoURL = result.songInfo.videoTargetMap.catbox[resolution];
            if (videoURL !== undefined) {
                videoDlBtn.self.data("url", CatboxUrlPrefix + videoURL).removeClass("disabled");
                break;
            }
        }
        // update audio URL
        const audioURL = result.songInfo.videoTargetMap.catbox["0"];
        if (audioURL !== undefined) {
            audioDlBtn.self.data("url", CatboxUrlPrefix + audioURL).removeClass("disabled");
        } else {
            audioDlBtn.self.removeData("url").addClass("disabled");
        }
        if (this.isAutoDlRunning) {
            // check if player's answer is correct
            let isCorrect = undefined;
            let findPlayer = Object.values(quiz.players as any[]).find((tmpPlayer) => {
                return tmpPlayer._name === selfName && tmpPlayer.avatarSlot._disabled === false;
            });
            if (findPlayer !== undefined) {
                let playerIdx = Object.values(result.players as any[]).findIndex(tmpPlayer => {
                    return findPlayer.gamePlayerId === tmpPlayer.gamePlayerId;
                });
                isCorrect = result.players[playerIdx].correct;
            }
            // auto download
            const autoDlOnWrong = (this.options.get('autoDlOnWrong') as CheckboxOption).getValue();
            if (!autoDlOnWrong || (isCorrect !== undefined && !isCorrect)) {
                const autoDlMedia = (this.options.get('autoDlMedia') as CheckboxOption).getValue();
                const autoDlInfo = (this.options.get('autoDlInfo') as CheckboxOption).getValue(); 
                if (autoDlMedia) {
                    const mediaType = (this.options.get('autoDlMediaType') as RadioOption<MediaType>).getValue();
                    if (mediaType === 'Audio') {
                        audioDlBtn.self.trigger('click');
                    } else if (mediaType === 'Video') {
                        videoDlBtn.self.trigger('click');
                    }
                }
                if (autoDlInfo) {
                    infoDlBtn.self.trigger('click');
                }
            }
        }
    }

    private async downloadSongData(url: string, interactive=false) {
        const fileName = this.nameFromSongInfo();
        const fileExt = url.split('.').pop()!;
        const mp3Info = this.getMp3Info();
        if (interactive) {
            alert(`Downloading song: ${fileName}`);
        }
        const response = await fetch(url);
        let blob: Blob;
        if (fileExt === 'mp3') {
            const mp3 = await response.arrayBuffer();
            mp3Info.cover = await getAnimeImage(mp3Info.annId);
            const taggedMp3 = addMp3Tag(mp3, mp3Info);
            if (taggedMp3 === null) {
                console.warn(`Failed to add mp3 tag, download origin mp3...`);
                blob = new Blob([mp3], {type: 'audio/mpeg'});
            } else {
                console.log('Download tagged mp3');
                blob = new Blob([taggedMp3], {type: 'audio/mpeg'});
            }

        } else {
            blob = await response.blob();
        }
        downloadBlob(blob, `${fileName}.${fileExt}`);
    }

    private downloadSongInfo() {
        const fileName = this.nameFromSongInfo();
        const text = JSON.stringify(this.currentSongInfo);
        const blob = new Blob([text], {type: 'text/plain'});
        downloadBlob(blob, `${fileName}.txt`);
    }

    private nameFromSongInfo() {
        const animeName = this.currentSongInfo.animeNames.romaji;
        const songName = this.currentSongInfo.songName;
        const type = this.songType();
        const artist = this.currentSongInfo.artist;
        return `[${animeName}(${type})] ${songName} (${artist})`;
    }

    private getMp3Info(): Mp3Info {
        const catbox = this.currentSongInfo.videoTargetMap['catbox'];
        const opm = this.currentSongInfo.videoTargetMap['openingsmoe'];
        return {
            animeName: this.currentSongInfo.animeNames.romaji,
            songName: this.currentSongInfo.songName,
            type: this.songType(),
            artist: this.currentSongInfo.artist,
            annId: this.currentSongInfo.annId,
            cover: null,
            videoUrl: {
                'catbox_480': catbox && catbox['480'] && CatboxUrlPrefix + catbox['480'],
                'catbox_720': catbox && catbox['720'] && CatboxUrlPrefix + catbox['720'],
                'openingsmoe': opm && opm['720'],
            },
        }
    }

    private songType() {
        switch (this.currentSongInfo.type) {
            case 1:
                return `Opening ${this.currentSongInfo.typeNumber}`;
            case 2:
                return `Ending ${this.currentSongInfo.typeNumber}`;
            case 3:
                return 'Insert Song';
            default:
                return '';
        }
    }
}

function downloadBlob(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    $(`<a></a>`)
        .attr('href', url)
        .attr("download", fileName)
        .get(0)!
        .click();
    console.log(`Download: ${fileName}`);
    setTimeout(() => {
        URL.revokeObjectURL(url);
        console.log(`revoke url of ${fileName}`);
    }, 1000);
}

function addMp3Tag(data: ArrayBuffer, info: Mp3Info): null | Buffer {
    const mp3tag = new MP3Tag(data);
    mp3tag.read();
    if (mp3tag.error !== '') {
        console.warn(`"${info.artist} - ${info.songName}" read tag fail`);
        return null;
    }
    // mp3tag.remove();
    mp3tag.tags.title = info.songName;
    mp3tag.tags.artist = info.artist;
    mp3tag.tags.album = info.animeName;
    
    let comment = '';
    if (info.videoUrl.catbox_480) {
        comment += `Catbox 480p: ${info.videoUrl.catbox_480}\n`;
    }
    if (info.videoUrl.catbox_720) {
        comment += `Catbox 720p: ${info.videoUrl.catbox_720}\n`;
    }
    if (info.videoUrl.openingsmoe) {
        comment += `OpeningsMoe: ${info.videoUrl.openingsmoe}\n`;
    }
    mp3tag.tags.comment = comment;

    if (info.cover !== null) {
        mp3tag.tags.v2.APIC = [{
            format: info.cover.contentType,
            type: 3,
            description: 'anime cover from animenewsnetwork',
            data: info.cover.data,
        }]
    }
    const ret = mp3tag.save({
        id3v1: { include: false },
        id3v2: {
            include: true,
            version: 3,
        },
    }) as Buffer;
    if (mp3tag.error !== '') {
        console.warn(`"${info.artist} - ${info.songName}" write tag fail`);
        return null;
    }
    return ret;
}

function main() {
    onStartPageLoaded(() => {
        registerPlugin(new Downloader());
    });
}

$(main);
