import { Pressable, StyleSheet, Text } from 'react-native';

export default function CloseButton({ onPress }) {
    return (
        <Pressable
            onPress={onPress}
            hitSlop={20}
            style={({ pressed }) => [styles.container, pressed && styles.pressed]}
        >
            <Text style={styles.text}>✕</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: -15,
        right: -15,

        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#ff4d4d',
        borderWidth: 2,
        borderColor: '#ffffff',

        justifyContent: 'center',
        alignItems: 'center',

        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        zIndex: 2000,
    },
    pressed: {
        transform: [{ scale: 0.9 }],
        backgroundColor: '#d63030',
    },
    text: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: -2,
    },
});
