import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {generateWallCircles} from "../utils/gameUtils";

const CircleWithLabel = ({ x, y, size, color, label }) => {
    return (
        <View style={[styles.container, { left: x, top: y }]}>
            <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2, backgroundColor: color || 'tomato' }]} />
            {label && <Text style={styles.text}>{label}</Text>}
        </View>
    );
};

export default function OtherPlayers() {
    const circlesToDraw = generateWallCircles();

    return (
        <>
            {circlesToDraw.map(circle => (
                <CircleWithLabel
                    key={circle.id}
                    {...circle}
                />
            ))}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignItems: 'center',
    },
    circle: {
        marginBottom: 5,
    },
    text: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});