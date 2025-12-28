import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const cards_data = {
    0: { img: require('../assets/textures/cards/0.png'), name: 'Back' },
    1: { img: require('../assets/textures/cards/1.png'), name: 'Exploding Pig' },
    2: { img: require('../assets/textures/cards/2.png'), name: 'Defusion Pig' },
    3: { img: require('../assets/textures/cards/3.png'), name: 'Skip' },
    4: {
        img: require('../assets/textures/cards/4.png'),
        name: 'Skip everything',
    },
    5: { img: require('../assets/textures/cards/5.png'), name: 'Reverse' },
    6: { img: require('../assets/textures/cards/6.png'), name: 'Attack' },
    7: { img: require('../assets/textures/cards/7.png'), name: 'Sniper' },
    8: { img: require('../assets/textures/cards/8.png'), name: 'Shuffle' },
    '9_3': {
        img: require('../assets/textures/cards/9_3.png'),
        name: 'View the future (3 cards)',
    },
    '9_4': {
        img: require('../assets/textures/cards/9_4.png'),
        name: 'View the future (4 cards)',
    },
    '9_5': {
        img: require('../assets/textures/cards/9_5.png'),
        name: 'View the future (5 cards)',
    },
    '10_3': {
        img: require('../assets/textures/cards/10_3.png'),
        name: 'Change the future (3 cards)',
    },
    '10_4': {
        img: require('../assets/textures/cards/10_4.png'),
        name: 'Change the future (4 cards)',
    },
    '10_5': {
        img: require('../assets/textures/cards/10_5.png'),
        name: 'Change the future (5 cards)',
    },
    11: { img: require('../assets/textures/cards/11.png'), name: 'Fundraiser' },
    12: { img: require('../assets/textures/cards/12.png'), name: 'Profanation' },
    13: { img: require('../assets/textures/cards/13.png'), name: 'Nu Nu Nu' },
    '14_1': { img: require('../assets/textures/cards/14_1.png'), name: 'Cake' },
    '14_2': {
        img: require('../assets/textures/cards/14_2.png'),
        name: 'Ice cream',
    },
    '14_3': {
        img: require('../assets/textures/cards/14_3.png'),
        name: 'Cupcake',
    },
    '14_4': {
        img: require('../assets/textures/cards/14_4.png'),
        name: 'Rum bomb',
    },
    '14_5': {
        img: require('../assets/textures/cards/14_5.png'),
        name: 'Cake slice',
    },
    15: {
        img: require('../assets/textures/cards/15.png'),
        name: 'Candy pumpkin',
    },
    16: { img: require('../assets/textures/cards/16.png'), name: 'Favor' },
    17: { img: require('../assets/textures/cards/17.png'), name: 'Piggasaki' },
    18: { img: require('../assets/textures/cards/18.png'), name: 'Hiropiga' },
    19: {
        img: require('../assets/textures/cards/19.png'),
        name: 'Take from the bottom',
    },
};

export function isGameCode(str) {
    return str.length === 5 && /^\d{5}$/.test(str);
}

export const range = n => [...Array(n).keys()];

export const coords = {
    thrown: { x: width / 2 + 55, y: height / 2 },
    deck: { x: width / 2 - 55, y: height / 2 },
    hand: { x: width / 2, y: height - 100 },
};

let tempCoords = [
    [0.9, 0.7],
    [0.8, 0.25],
    [0.65, 0.1],
    [0.5, 0.1],
    [0.35, 0.1],
    [0.2, 0.25],
    [0.1, 0.7],
];
const playerCoords = tempCoords.map(x => [x[0] * width, x[1] * height]);
const playerOffsets = {
    0: [],
    1: [],
    2: [3],
    3: [2, 4],
    4: [1, 3, 5],
    5: [1, 2, 4, 5],
    6: [0, 2, 3, 4, 6],
    7: [0, 1, 2, 4, 5, 6],
    8: [0, 1, 2, 3, 4, 5, 6],
};

export function coordsAnimHandler(target) {
    if (target === 'thrown' || target === 'deck' || target === 'hand') return { ...coords[target] };
    return { x: width / 2, y: 200 };
}

export const generateWallCircles = cards => {
    const circles = [];
    playerOffsets[Object.keys(cards)?.length ?? 1].map((val, i) => {
        let c = playerCoords[val];
        circles.push({
            id: `playerCircle-${i}`,
            x: c[0],
            y: c[1],
            size: 80,
            color: i % 2 === 0 ? '#3498db' : '#db3434ff',
            label: cards?.[i + 1]?.nickname,
        });
    });

    return circles;
};
