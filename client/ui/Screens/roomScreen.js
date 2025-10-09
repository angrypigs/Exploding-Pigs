import {SocketContext} from "../../contexts/socketContext";
import React, {useState, useContext, useEffect} from "react";
import {View, Text, StyleSheet} from "react-native";
import {useRoute} from "@react-navigation/native";

import {stylesMain} from "../../styles/style_main";
import {PlayerList} from "../components/player_list";
import {stylesButton} from "../../styles/style_custom_components";
import {Button} from "../components/button"


export default function RoomScreen({navigation}) {
    const socket = useContext(SocketContext);
    const route = useRoute();
    console.log(route.params, "route.params")
    const {roomCode, nickname, name} = route.params;

    const handlePlayerReady = () => {
        socket.emit("playerReady", roomCode);
    }

    const [players, setPlayers] = useState([]);

    useEffect(() => {
        socket.on("refreshRoom", (newPlayers) => {
            if (newPlayers) setPlayers(newPlayers);
        });
        return () => socket.off("refreshRoom");
    }, [socket]);

    useEffect(() => {
        socket.on("roomReady", () => {
            navigation.navigate("Game", {roomCode: roomCode, nickname, name});
        });
        return () => socket.off("roomReady");
    }, [socket]);

    socket.emit("refreshRoom", roomCode);


    return (
        <View style={styles.container}>
            <Text style={styles.text}>Game Room</Text>
            <Text style={styles.text}>Room code: {roomCode}</Text>
            <Text style={styles.text}>Nickname: {nickname}</Text>
            {name ? <Text style={styles.text}>Name: {name}</Text> : null}
            <PlayerList players={players} setPlayers={setPlayers}/>
            <Button title="Ready" onPress={handlePlayerReady}/>
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