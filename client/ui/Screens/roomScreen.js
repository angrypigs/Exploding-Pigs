import { SocketContext } from "../../contexts/socketContext";
import React, { useState, useContext, useEffect } from "react";
import { View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";

import { stylesMain } from "../../styles/style_main";
import { PlayerList } from "../components/player_list";
import { Button } from "../components/button"


export default function RoomScreen({ navigation }) {
    const socket = useContext(SocketContext);
    const route = useRoute();
    //console.log(route.params, "route.params")
    const { roomCode, nickname, name } = route.params;

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
            navigation.replace("Game", { roomCode: roomCode, nickname, name });
        });
        return () => socket.off("roomReady");
    }, [socket]);

    socket.emit("refreshRoom", roomCode);


    return (
        <View style={stylesMain.container}>
            <View style={stylesMain.header}>
                <Text style={stylesMain.text}>Game Room {roomCode}</Text>
                <Text style={stylesMain.text}>Nickname: {nickname}</Text>
                {name ? <Text style={stylesMain.text}>Name: {name}</Text> : null}
            </View>
            <PlayerList players={players} setPlayers={setPlayers} />
            <Button title="Ready" onPress={handlePlayerReady} />
        </View>
    );
}
