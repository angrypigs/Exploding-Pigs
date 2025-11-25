import React, {useState} from "react";
import {Image, Pressable, StyleSheet} from "react-native";
import {cards_data} from "../../utils";


export default function Card({type, onPress, style, zoom}) {
    const card = cards_data[type];
    if (!card) return null;
    const [isHovered, setIsHovered] = useState(false); // 2. Add hover state

    if (!card) return null;

    return (
        <Pressable
            onPress={onPress}
            // 3. Apply conditional style
            style={[
                styles.card,       // Base style
                style,             // Parent style (from GameScreen)
                isHovered && styles.hoveredCard // Apply hover style when true
            ]}
            // 4. Add event handlers to update state
            onHoverIn={() => {
                // Only set hover state if the zoom prop is true
                if (zoom) {
                    setIsHovered(true);
                }
            }}
            onHoverOut={() => setIsHovered(false)}
        >
            <Image
                source={card.img}
                resizeMode="contain"
                style={styles.image}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 100,
        height: 150,
        margin: 5,
        transitionProperty: 'transform',
        transitionDuration: '0.1s',
    },
    image: {
        width: "100%",
        height: "100%",
    },
    hoveredCard: {
        transform: [
            {scale: 3},     // Make it 15% bigger
            {translateY: -50}  // Lift it up by 10 pixels
        ],
        zIndex: 1000,          // CRITICAL: Make sure it's on top of other cards
    },
});