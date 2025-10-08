import { SocketContext } from "../contexts/socketContext";
import React, { useState, useContext, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { useRoute } from "@react-navigation/native";

import { stylesMain } from "../styles/style_main";
import { PlayerList } from "../components/player_list";
import { stylesButton } from "../styles/style_custom_components";

export default function GameScreen({ navigation }) {
    const socket = useContext(SocketContext);

    const route = useRoute();
    const { roomCode, nickname, name } = route.params;

    const [players, setPlayers] = useState([]);

    useEffect(() => {
        socket.on("refreshRoom", (newPlayers) => {
            if (newPlayers) setPlayers(newPlayers);
        });
        return () => socket.off("refreshRoom");
        }, [socket]);
    
    socket.emit("refreshRoom", roomCode);

  return (
    <View style={stylesMain.container}>
        <Text style={stylesMain.text}>Game 💀 Room</Text>
        <Text style={stylesMain.text}>Room code: {roomCode}</Text>
        <Text style={stylesMain.text}>Nickname: {nickname}</Text>
        {name ? <Text style={stylesMain.text}>Name: {name}</Text> : null}
        <PlayerList players={players} setPlayers={setPlayers} />
    </View>
  );
}