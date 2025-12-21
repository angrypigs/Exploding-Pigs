import { useState } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { cards_data } from '../../utils';

export default function Card({ type, onPress, style, zoom, isChosen, coords }) {
    const card = cards_data[type];
    const [isHovered, setIsHovered] = useState(false);

    if (!card) return null;
    const topleft = coords
        ? {
              top: coords[1],
              left: coords[0],
              transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
          }
        : {};

    return (
        <Pressable
            onPress={onPress}
            style={[styles.cardWrapper, style, isHovered && styles.hoveredTransform, topleft]}
            onHoverIn={() => zoom && setIsHovered(true)}
            onHoverOut={() => setIsHovered(false)}
        >
            <Shadow
                disabled={!isChosen}
                startColor={'#dcea12'}
                endColor={'#dcea1200'}
                distance={isChosen ? 15 : 0}
                offset={[0, 0]}
                paintInside={false}
                style={styles.shadowContainer}
            >
                <Image source={card.img} resizeMode="contain" style={styles.image} />
            </Shadow>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    cardWrapper: {
        width: 100,
        height: 150,
        margin: 5,
        position: 'absolute',
        backgroundColor: 'transparent',
    },
    shadowContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 0,
    },
    image: {
        width: 100,
        height: 150,
    },
    hoveredTransform: {
        transform: [{ scale: 1.1 }, { translateY: -20 }],
        zIndex: 1000,
    },
});
