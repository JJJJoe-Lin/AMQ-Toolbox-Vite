import { 
    AmqtbButton,
    AmqtbButtonContainer,
    AmqtbCheckbox,
    AmqtbOptions,
    AmqtbRadio,
    AmqtbViewBlock,
    AMQ_Toolbox,
    Plugin,
} from 'amq-toolbox';
import { getAnimeImage, Image } from './cover';

declare var amqToolbox: AMQ_Toolbox;
declare var Listener: any;
declare var quiz: any;
declare var selfName: any;

declare var MP3Tag: any;

interface Mp3Info {
    animeName: string;
    songName: string;
    type: string;
    artist: string;
    cover: Image | null;
}

class Downloader implements Plugin {
    name = 'Downloader';
    options: AmqtbOptions;
    view: AmqtbViewBlock;
    private _enabled = false;
    private currentSongInfo: any;
    private isAutoDlRunning: boolean;
    private btnContainer: AmqtbButtonContainer;
    private answerResultListener: any;

    constructor() {
        this.isAutoDlRunning = false;
        
        this.options = new AmqtbOptions({
            title: this.name,
        });
        this.options.add(new AmqtbCheckbox({
            id: 'amqtbDownloaderAutoDlOnWrong',
            name: 'autoDlOnWrong',
            label: 'Auto download only on wrong',
            offset: 0,
            defaultChecked: false,
            enables: [],
        }));
        this.options.add(new AmqtbCheckbox({
            id: 'amqtbDownloaderAutoDlMedia',
            name: 'autoDlMedia',
            label: 'Auto download media',
            offset: 0,
            defaultChecked: false,
            enables: ['autoDlMediaType'],
        }));
        const radio = new AmqtbRadio({
            id: 'amqtbDownloaderAutoDlMediaType',
            name: 'autoDlMediaType',
            label: 'Media Type',
            choices: [
                {
                    label: 'Audio',
                    value: 'audio',
                },
                {
                    label: 'Video',
                    value: 'video',
                },
            ],
            defaultValue: 'video',
        });
        this.options.add(radio);
        this.options.add(new AmqtbCheckbox({
            id: 'amqtbDownloaderAutoDlInfo',
            name: 'autoDlInfo',
            label: 'Auto download info',
            offset: 0,
            defaultChecked: false,
            enables: [],
        }));

        this.btnContainer = new AmqtbButtonContainer({});
        const autoDlBtn = new AmqtbButton({
            name: 'autoDlBtn',
            label: 'Start AutoDL',
            size: 'extra-small',
            style: 'success',
        });
        const videoDlBtn = new AmqtbButton({
            name: 'videoDlBtn',
            label: 'Video',
            size: 'extra-small',
            style: 'primary',
        });
        const audioDlBtn = new AmqtbButton({
            name: 'audioDlBtn',
            label: 'Audio',
            size: 'extra-small',
            style: 'primary',
        });
        const infoDlBtn = new AmqtbButton({
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
                this.downloadSongData(videoDlBtn.self.data("url"));
            }
        });
        audioDlBtn.self.on('click', () => {
            if (audioDlBtn.self.data("url") !== undefined) {
                this.downloadSongData(audioDlBtn.self.data("url"));
            }
        });
        infoDlBtn.self.on('click', () => {
            this.downloadSongInfo();
        });
        this.btnContainer.add(autoDlBtn, videoDlBtn, audioDlBtn, infoDlBtn);
        this.view = new AmqtbViewBlock({
            title: 'Download',
            content: this.btnContainer.self,
        });

        this.answerResultListener = new Listener("answer results", this.answerResultHanler.bind(this));
    }

    get enabled() {
        return this._enabled;
    }

    set enabled(val: boolean) {
        if (val !== this._enabled) {
            this._enabled = val;
            if (val) {
                this.answerResultListener.bindListener();
            } else {
                this.answerResultListener.unbindListener();
            }
        }
    }

    private answerResultHanler(result: any) {
        this.currentSongInfo = result.songInfo;
        const resolutions = ["720", "480"];
        const videoDlBtn = this.btnContainer.get('videoDlBtn')!;
        const audioDlBtn = this.btnContainer.get('audioDlBtn')!;
        const infoDlBtn = this.btnContainer.get('infoDlBtn')!;
        // update video URL
        videoDlBtn.self.removeData("url").addClass("disabled");
        for (let resolution of resolutions) {
            let videoURL = result.songInfo.urlMap.catbox[resolution];
            if (videoURL !== undefined) {
                videoDlBtn.self.data("url", videoURL).removeClass("disabled");
                break;
            }
        }
        // update audio URL
        const audioURL = result.songInfo.urlMap.catbox["0"];
        if (audioURL !== undefined) {
            audioDlBtn.self.data("url", audioURL).removeClass("disabled");
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
            const autoDlOnWrong = this.options.get('autoDlOnWrong') as AmqtbCheckbox;
            if (autoDlOnWrong.checked || (isCorrect !== undefined && !isCorrect)) {
                const autoDlMedia = this.options.get('autoDlMedia') as AmqtbCheckbox;
                const autoDlInfo = this.options.get('autoDlInfo') as AmqtbCheckbox; 
                if (autoDlMedia.checked) {
                    const mediaType = this.options.get('autoDlMediaType') as AmqtbRadio;
                    if (mediaType.value === 'audio') {
                        audioDlBtn.self.trigger('click');
                    } else if (mediaType.value === 'video') {
                        videoDlBtn.self.trigger('click');
                    }
                }
                if (autoDlInfo.checked) {
                    infoDlBtn.self.trigger('click');
                }
            }
        }
    }

    private async downloadSongData(url: string, interactive=false) {
        const fileName = this.nameFromSongInfo();
        const fileExt = url.split('.').pop()!;
        if (interactive) {
            alert(`Downloading song: ${fileName}`);
        }
        const response = await fetch(url);
        let blob: Blob;
        if (fileExt === 'mp3') {
            const mp3 = await response.arrayBuffer();
            const info = await this.getMp3Info();
            const taggedMp3 = addMp3Tag(mp3, info);
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

    private async getMp3Info(): Promise<Mp3Info> {
        return {
            animeName: this.currentSongInfo.animeNames.romaji,
            songName: this.currentSongInfo.songName,
            type: this.songType(),
            artist: this.currentSongInfo.artist,
            cover: await getAnimeImage(this.currentSongInfo.annId),
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
    $(`<a></a>`)
        .attr('href', URL.createObjectURL(blob))
        .attr("download", fileName)
        .get(0)!
        .click();
    console.log(`Download: ${fileName}`);
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

function setup() {
    if ((unsafeWindow as any).amqToolbox === undefined) {
        (unsafeWindow as any).amqToolbox = new AMQ_Toolbox();
    }
    const plugin = new Downloader();
    const err = amqToolbox.registerPlugin(plugin);
    if (err) {
        console.error(err);
        plugin.enabled = false;
        return;
    }
}

function main() {
    if (document.getElementById('startPage')) return;
    let loadInterval = setInterval(() => {
        if ($('#loadingScreen').hasClass('hidden')) {
            try {
                setup();
            } finally {
                clearInterval(loadInterval);
            }
        }
    }, 500);
}

$(main);