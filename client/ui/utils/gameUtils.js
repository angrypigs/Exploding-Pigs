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

export function coordsAnimHandler(target) {
    if (target === 'thrown' || target === 'deck') return { ...coords[target] };
    let points = target.split(':').map(Number);
    return { x: coords.card.x(0), y: coords.card.y(points[0]) };
}

export const generateWallCircles = () => {
    const circles = [];
    const CIRCLE_SIZE = 80;
    const PADDING = 30;
    const LABEL_HEIGHT_APPROX = 20;

    // 1. Left Wall
    for (let i = 1; i <= 2; i++) {
        circles.push({
            id: `left-${i}`,
            x: PADDING,
            y: (height / 3) * i - CIRCLE_SIZE / 2 - LABEL_HEIGHT_APPROX / 2,
            size: CIRCLE_SIZE,
            color: '#3498db',
            label: `Left ${i}`,
        });
    }

    // 2. Top Wall
    for (let i = 1; i <= 3; i++) {
        circles.push({
            id: `top-${i}`,
            x: (width / 4) * i - CIRCLE_SIZE / 2,
            y: PADDING,
            size: CIRCLE_SIZE,
            color: '#e74c3c',
            label: `Top ${i}`,
        });
    }

    // 3. Right Wall
    for (let i = 1; i <= 2; i++) {
        circles.push({
            id: `right-${i}`,
            x: width - CIRCLE_SIZE - PADDING,
            y: (height / 3) * i - CIRCLE_SIZE / 2 - LABEL_HEIGHT_APPROX / 2,
            size: CIRCLE_SIZE,
            color: '#2ecc71',
            label: `Right ${i}`,
        });
    }

    return circles;
};