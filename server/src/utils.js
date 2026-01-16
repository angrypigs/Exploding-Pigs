import data from '../cards_data.json' with { type: 'json' };
export { data };

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

export function insertRandom(arr, element) {
    const index = Math.floor(Math.random() * (arr.length + 1));
    arr.splice(index, 0, element);
    return arr;
}

export function getSecondInt(str) {
    const i = str.indexOf('_');
    return Number(str.slice(i + 1));
}

export function addActions(act, actAdd) {
    if (!actAdd) return act;
    for (const key in actAdd) {
        if (Array.isArray(act[key])) act[key].push(...actAdd[key]);
        else act[key] = [...actAdd[key]];
    }
    return act;
}
