import { SocketContext } from "../../contexts/socketContext";
import React, { useState, useContext, useEffect } from "react";
import { View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";

import { stylesMain } from "../../styles/style_main";
import Card from "../components/card";

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
            }
        });
        return () => socket.off("refreshGame");
    }, [socket]);

  return (
    <View style={stylesMain.container}>
        <Text style={stylesMain.text}>Room code: {roomCode}</Text>
        <Text style={stylesMain.text}>Nickname: {nickname}</Text>
        {Object.entries(cards).map(([p, arr], j) => {
            arr.map((c, i) => {
                <Card type={c} onPress={() => console.log(c)} data={"" + i}/>
            })
        })}
        {thrown && <Card type={thrown} onPress={() => console.log(thrown)} data={"thrown"} />}
        {deck && <Card type={deck} onPress={() => console.log(deck)} data={"deck"} />}
    </View>
  );
}
