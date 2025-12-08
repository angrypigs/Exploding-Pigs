import fs from 'fs';

export const data = JSON.parse(fs.readFileSync('../cards_data.json', 'utf8'));

export function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export function rotateArray(arr, shift) {
    const n = arr.length;
    const k = ((shift % n) + n) % n;
    return arr.slice(k).concat(arr.slice(0, k));
}
