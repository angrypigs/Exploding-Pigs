import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const coords = {
    thrown: { x: width / 2 + 100, y: height - 100 },
    deck: { x: width / 2, y: height / 2 },
    card: {
        x: c => width / 2 - 200 + c * 50,
        y: p => height - 130 * (p + 1),
    },
};

let tempCoords = [
    [0.1, 0.7],
    [0.2, 0.3],
    [0.35, 0.2],
    [0.5, 0.1],
    [0.65, 0.2],
    [0.8, 0.3],
    [0.9, 0.7],
];
const playerCoords = tempCoords.filter(x => [x[0] * width, x[1] * height]);
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
    if (target === 'thrown' || target === 'deck') return { ...coords[target] };
    let points = target.split(':').map(Number);
    return { x: coords.card.x(0), y: coords.card.y(points[0]) };
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
