interface Weight {
    songNum: number;
    avgWeight: number;
}

interface SongData {
    difficulty: number;
    type: number;
    weight: number;
}

interface Item {
    diffStart: number;
    diffEnd: number;
    type: number;
    weight: number;
}

let items: Item[] = [];

export function main (min: number, max: number) {
    let rangeWeight: Weight[][] = [];
    for (let i = 0; i < 100; i++) {
        rangeWeight[i] = [];
        for (let j = 0; j < 8; j++) {
            rangeWeight[i][j] = {songNum: 0, avgWeight: 0};
        }
    }

    let songs: SongData[] = []
    for (let song of songs) {
        let rw = rangeWeight[song.difficulty][song.type];
        rw.avgWeight = (rw.songNum * rw.avgWeight) + song.weight / (rw.songNum + 1);
        rw.songNum++;
    }

    // let num = 0;
    let item: Item;
    for (let j = 0; j < 8; j++) {
        for (let i = 0; i < 100; i++) {
            let w: Weight = {songNum: 0, avgWeight: 0};
            let k: number;
            for (k = i; k < 100 && w.songNum < min; k++) {
                // TODO: add each type
                let rw = rangeWeight[k][i];
                w.avgWeight = (w.songNum * w.avgWeight) + (rw.songNum * rw.avgWeight) / (w.songNum + rw.songNum);
                w.songNum += rw.songNum;
            }
            items.push({
                diffStart: i,
                diffEnd: k,
                type: j,
                weight: w.avgWeight,
            });
        }
    }
}
