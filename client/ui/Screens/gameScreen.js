import { SocketContext } from "../../contexts/socketContext";
import React, { useState, useContext, useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
import { useRoute } from "@react-navigation/native";

import { stylesMain } from "../../styles/style_main";
import Card from "../components/card";

const { width, height } = Dimensions.get('window');

export default function GameScreen({ navigation }) {
    const socket = useContext(SocketContext);
    const route = useRoute();
    const { roomCode, nickname, name } = route.params;

    console.log('game screen')
    const [cards, setCards] = useState({});
    const [thrown, setThrown] = useState(null);
    const [deck, setDeck] = useState(null);
    const [anims, setAnims] = useState([]);

    useEffect(() => {
        socket.on("refreshGame", (anims, cards, deck, thrown) => {
            if (anims) {
                setCards(cards);
                setThrown(thrown);
                setDeck(deck);
                setAnims(anims);
                console.log(cards);
                console.log(anims);
            }
        });
        return () => socket.off("refreshGame");
    }, [socket]);

    const handleTakeCard = () => {
        socket.emit("takeCard", roomCode);
    }

    return (
        <View style={stylesMain.container}>
            <View style={stylesMain.header}>
                <Text style={stylesMain.text}>Room code: {roomCode}</Text>
                <Text style={stylesMain.text}>Nickname: {nickname}</Text>
            </View>
            {Object.entries(cards).map(([p, arr], j) => 
                arr.map((c, i) => (
                    <Card key={`${p}-${i}`} type={c} onPress={() => console.log(c)} coords={[width / 2 - 200 + i * 50, 200 * (j + 1)]} />
                ))
            )}
            {thrown && <Card type={thrown} onPress={() => console.log(thrown)} coords={[width / 2 + 100, height - 100]} />}
            {deck && <Card type={deck} onPress={handleTakeCard} coords={[width / 2, height - 100]} />}
        </View>
    );
}
