import { LinearGradient } from 'expo-linear-gradient';
import { useRef } from 'react';
import { Animated, Text, TouchableOpacity } from 'react-native';

import { stylesButton } from '../../styles/stylesCustomComponents';

export function Button({ title, onPress }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
        }).start();
        if (onPress) onPress();
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <LinearGradient
                    colors={['#178f23ff', '#3bfc25ff']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={stylesButton.button}
                >
                    <Text style={stylesButton.text}>{title}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
}
