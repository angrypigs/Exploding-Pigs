import { StyleSheet } from "react-native";

export const stylesButton = StyleSheet.create({
    button: {
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
    text: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
});

export const stylesPlayerList = StyleSheet.create({
    background: {
        padding: 10,
        borderRadius: 10,
        borderColor: "#608252ff",
        backgroundColor: "#a4cf93ff",
        width: 300,
    },
    tile: {
        backgroundColor: "#a3d9ff",
        padding: 15,
        marginVertical: 5,
        marginHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        width: 250,
    },
    text: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#004466",
    },
});