import { SocketContext } from "../../contexts/socketContext";
import React, { useState, useContext, useEffect, useRef } from "react";
import { View, Text, Dimensions } from "react-native";
import { useRoute } from "@react-navigation/native";
import uuid from 'react-native-uuid';

import { stylesMain } from "../../styles/style_main";
import Card from "../components/card";
import AnimatedCard from "../components/animatedCard";

const { width, height } = Dimensions.get('window');

const coords = {
    thrown: {x: width / 2 + 100, y: height - 100},
    deck: {x: width / 2, y: height - 100},
    card: {
        x: (c) => width / 2 - 200 + c * 50,
        y: (p) => 200 * (p + 1)
    }
}

function coordsAnimHandler(target) {
    if (target === "thrown" || 
        target === "deck") return { ...coords[target] };
    let points = target.split(":").map(Number);
    console.log(points)
    return {x: coords.card.x(points[1]), y: coords.card.y(points[0])}
}

export default function GameScreen({ navigation }) {
    const socket = useContext(SocketContext);
    const route = useRoute();
    const { roomCode, nickname, name } = route.params;

    const [cards, setCards] = useState({});
    const [thrown, setThrown] = useState(null);
    const [deck, setDeck] = useState(null);
    const [anims, setAnims] = useState(null);
    const [animTrigger, setAnimTrigger] = useState(false);

    const cards_ref = useRef({});
    const thrown_ref = useRef(null);
    const deck_ref = useRef(null);


    useEffect(() => {
        if (anims === null) {
            setCards(cards_ref.current);
            setThrown(thrown_ref.current);
            setDeck(deck_ref.current);
            console.log(cards);
            console.log(deck);
        }
    }, [animTrigger]);

    useEffect(() => {
        socket.on("refreshGame", (newAnims, cards, deck, thrown) => {
            cards_ref.current = cards;
            thrown_ref.current = thrown;
            deck_ref.current = deck;
            console.log(newAnims)
            console.log(cards_ref.current)
            let tempAnims = null;
            if (newAnims) {
                tempAnims = {};
                for (const a of newAnims) {
                    if (a[0] === "move") {
                        let c_start = coordsAnimHandler(a[1]);
                        let c_end = coordsAnimHandler(a[2]);
                        tempAnims[uuid.v4()] = {
                            type: "move", x: c_start.x, y: c_start.y,
                            targetX: c_end.x, targetY: c_end.y, type: a[3]
                        }
                    }
                }
            }
            setAnims(tempAnims);
            setAnimTrigger(prev => !prev);
        });
        return () => socket.off("refreshGame");
    }, [socket]);

    const handleTakeCard = () => {
        socket.emit("takeCard", roomCode); 
    }

    const removeAnim = (id) => {
    setAnims(prev => {
        const next = { ...prev };
        delete next[id];
        if (Object.keys(next).length === 0) {
            setAnimTrigger(prev => !prev);
            return null;
        }
        return next;
    });
}

    return (
        <View style={stylesMain.container}>
            <View style={stylesMain.header}>
                <Text style={stylesMain.text}>Room code: {roomCode}</Text>
                <Text style={stylesMain.text}>Nickname: {nickname}</Text>
            </View>
            {cards && Object.entries(cards).map(([p, arr], j) => 
                arr.map((c, i) => (
                    <Card key={`${p}-${i}`} type={c} onPress={() => console.log(c)} coords={[coords.card.x(i), coords.card.y(j)]} />
                ))
            )}
            {thrown && <Card type={thrown} onPress={() => console.log(thrown)} coords={[coords.thrown.x, coords.thrown.y]} />}
            {deck && <Card type={deck} onPress={handleTakeCard} coords={[coords.deck.x, coords.deck.y]} />}
            {anims && Object.entries(anims).map(([uuid, animData]) => (
                <AnimatedCard
                    key={uuid}                 // unikalny klucz dla React
                    animData={animData}        // cały słownik z danymi animacji
                    onFinish={() => removeAnim(uuid)} // callback po zakończeniu animacji
                />
            ))}
        </View>
    );
}
