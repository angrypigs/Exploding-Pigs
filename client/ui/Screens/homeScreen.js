import {SocketContext} from "../../contexts/socketContext";
import React, {useState, useContext, useEffect} from "react";
import {View, Text, TextInput, Alert, StyleSheet} from "react-native";
import {isGameCode} from "../../utils"

import {stylesMain} from "../../styles/style_main";
import {Button} from "../components/button"

export default function HomeScreen({navigation}) {
    const [screen, setScreen] = useState("menu");
    const [inputs, setInputs] = useState({
        joinCode: "",
        joinNickname: "",
        joinName: "",
        createMaxPlayers: "",
        createNickname: "",
        createName: "",
    });
    const socket = useContext(SocketContext);

    useEffect(() => {
        socket.on("joinRoom", (code, nickname, name) => {
            if (code) {
                navigation.navigate("Room", {roomCode: code, nickname, name});
            } else {
                console.log(`Error while joining the room: ${nickname}`);
            }
        });
        return () => socket.off("joinRoom");
    }, [socket]);



    return (
        <View style={styles.container}>
            <Text style={styles.text}>Exploding Pigs</Text>
            <Button title="Join Room" onPress={() => navigation.navigate("JoinRoom")}/>
            <Button title="Create Room" onPress={() => navigation.navigate("CreateRoom")}/>
        </View>
    );
}


export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        gap: 20,
        alignItems: "center",
        textAlign: "center",
        padding: 20,
        backgroundColor: "rgba(143, 143, 143, 1)",
    },
    text: {
        fontSize: 22,
        fontWeight: "bold",
    },
})