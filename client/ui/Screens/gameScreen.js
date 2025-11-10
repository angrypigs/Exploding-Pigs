import { SocketContext } from "../../contexts/socketContext";
import React, { useState, useContext, useEffect, useRef } from "react";
import { View, Text, Dimensions, StyleSheet, ImageBackground } from "react-native";
import { useRoute } from "@react-navigation/native";
import uuid from 'react-native-uuid';

import { stylesMain } from "../../styles/style_main";
import Card from "../components/card";
import AnimatedCard from "../components/animatedCard";
import { Button } from "react-native-web";

const { width, height } = Dimensions.get('window');

const coords = {
    thrown: { x: width / 2 + 100, y: height - 100 },
    deck: { x: width / 2, y: height - 100 },
    card: {
        x: (c) => width / 2 - 200 + c * 50,
        y: (p) => 200 * (p + 1)
    }
}

function coordsAnimHandler(target) {
    if (target === "thrown" ||
        target === "deck") return { ...coords[target] };
    let points = target.split(":").map(Number);
    return { x: coords.card.x(0), y: coords.card.y(points[0]) }
}

const Circle = ({ x, y, size, color }) => {
    const circleStyle = {
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: size / 2, // This makes the view a circle
        backgroundColor: color || 'red', // Default color if none provided
    };
    return <View style={circleStyle} />;
};

export default function GameScreen({ navigation }) {
    const socket = useContext(SocketContext);
    const route = useRoute();
    const { roomCode, nickname, name } = route.params;

    const [cards, setCards] = useState({});
    const [cardsSelected, setCardsSelected] = useState(false);
    const [thrown, setThrown] = useState(null);
    const [deck, setDeck] = useState(null);
    const [anims, setAnims] = useState(null);
    const [animTrigger, setAnimTrigger] = useState(false);
    const [turnPointer, setTurnPointer] = useState(null);

    const cards_ref = useRef({});
    const cardsSelected_ref = useRef([]);
    const thrown_ref = useRef(null);
    const deck_ref = useRef(null);


    const CircleWithLabel = ({ x, y, size, color, label }) => {
        // Container for the circle and its label
        // Positioned absolutely
        const containerStyle = {
            position: 'absolute',
            left: x,
            top: y,
            alignItems: 'center', // Center the circle and text horizontally within its own container
        };

        const circleStyle = {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color || 'tomato',
            marginBottom: 5, // Small gap between circle and text
        };

        const textStyle = {
            color: 'white', // Default text color, adjust as needed
            fontSize: 16,
            fontWeight: 'bold',
        };

        return (
            <View style={containerStyle}>
                <View style={circleStyle} />
                {label && <Text style={textStyle}>{label}</Text>}
            </View>
        );
    };


    const generateWallCircles = (width, height) => {
        const circles = [];
        const CIRCLE_SIZE = 80; // The diameter of the circles
        const PADDING = 30;     // How far from the edge the circles should be
        const LABEL_HEIGHT_APPROX = 20; // Approximate height of the text label for vertical positioning

        // 1. Generate 2 circles on the LEFT wall
        for (let i = 1; i <= 2; i++) {
            circles.push({
                id: `left-${i}`,
                x: PADDING,
                // Adjust Y to account for the label's height below the circle
                y: (height / 3) * i - (CIRCLE_SIZE / 2) - (LABEL_HEIGHT_APPROX / 2),
                size: CIRCLE_SIZE,
                color: '#3498db', // Blue
                label: `Left ${i}`,
            });
        }

        // 2. Generate 3 circles on the TOP wall
        for (let i = 1; i <= 3; i++) {
            circles.push({
                id: `top-${i}`,
                // Adjust X to center the circle+label container
                x: (width / 4) * i - (CIRCLE_SIZE / 2),
                y: PADDING,
                size: CIRCLE_SIZE,
                color: '#e74c3c', // Red
                label: `Top ${i}`,
            });
        }

        // 3. Generate 2 circles on the RIGHT wall
        for (let i = 1; i <= 2; i++) {
            circles.push({
                id: `right-${i}`,
                // Adjust X to center the circle+label container
                x: width - CIRCLE_SIZE - PADDING,
                // Adjust Y to account for the label's height below the circle
                y: (height / 3) * i - (CIRCLE_SIZE / 2) - (LABEL_HEIGHT_APPROX / 2),
                size: CIRCLE_SIZE,
                color: '#2ecc71', // Green
                label: `Right ${i}`,
            });
        }

        return circles;
    };

    const circlesToDraw = generateWallCircles(width, height);

    useEffect(() => {
        if (anims === null) {
            setCards(cards_ref.current);
            setThrown(thrown_ref.current);
            setDeck(deck_ref.current);
        }
    }, [animTrigger]);

    useEffect(() => {
        socket.on("refreshGame", (newAnims, cards, deck, thrown) => {
            if (newAnims !== false) { // null as no animations, false as error / deny of move
                cards_ref.current = cards;
                thrown_ref.current = thrown;
                deck_ref.current = deck;
                // console.log(`New cards: ${cards_ref.current}`)
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
                setAnims(prev => {
                    if (!prev) return tempAnims;
                    return { ...prev, ...tempAnims };
                });
                setAnimTrigger(prev => !prev);
            }
        });
        return () => socket.off("refreshGame");
    }, [socket]);

    useEffect(() => {
        socket.on("nextTurn", (data) => {
            setTurnPointer(data);
            cardsSelected_ref.current = [];
            setCardsSelected(false);
        });
    }, [socket]);

    const handleTakeCard = () => {
        socket.emit("takeCard", roomCode);
    }

    const handleSelectCard = (index) => {
        if (cardsSelected_ref.current.includes(index)) {
            cardsSelected_ref.current = cardsSelected_ref.current.filter((i) => i != index);
            console.log("usuwany");
        } else {
            cardsSelected_ref.current.push(index);
            console.log("dodawany");
        }
        console.log(`selected ${cardsSelected_ref.current}`);
        setCardsSelected(cardsSelected_ref.current.length !== 0);
        ;
    }

    const handleThrowCard = () => {
        socket.emit("throwCard", roomCode, cardsSelected_ref.current);
        cardsSelected_ref.current = [];
    }

    const removeAnim = (id) => {
        setAnims(prev => {
            const next = { ...prev };
            delete next[id];
            if (Object.keys(next).length === 0) {
                setAnimTrigger(prev => !prev);
                socket.emit("nextTurn", roomCode);
                return null;
            }
            return next;
        });
    }



    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../../assets/pig-nose-svgrepo-com.png")} // Or use {uri: 'https://...'}} for a network image
                resizeMode="repeat"  // 'cover', 'contain', 'stretch', 'repeat', 'center'
                style={styles.imageBackground}
            >
            </ImageBackground>

            <View style={stylesMain.testGame}>
                <Text style={stylesMain.text}>Room code: {roomCode}</Text>
                <Text style={stylesMain.text}>Nickname: {nickname}</Text>
                {turnPointer && (
                    <Text style={stylesMain.text}>
                        Turn for player {turnPointer[0]}{'\n'} ({turnPointer[1]} turns)
                    </Text>
                )}
            </View>

            {(cards.length !== 0) && Object.entries(cards).map(([p, arr], j) =>
                arr.map((c, i) => (
                    <Card key={`${p}-${i}`} type={c} onPress={() => handleSelectCard(i)}
                        coords={[coords.card.x(i), coords.card.y(j)]} />
                    //TU DAC ANiMACJE
                ))
            )}

            {cardsSelected &&
                <Button title="Throw Selected Cards" onPress={handleThrowCard} />

            }

            {thrown &&
                <Card type={thrown} onPress={() => console.log(thrown)} coords={[coords.thrown.x, coords.thrown.y]} />}
            {deck && <Card type={deck} onPress={handleTakeCard} coords={[coords.deck.x, coords.deck.y]} />}
            {anims && Object.entries(anims).map(([uuid, animData]) => (
                <AnimatedCard
                    key={uuid}
                    animData={animData}
                    onFinish={() => removeAnim(uuid)}
                />
            ))}

            {circlesToDraw.map(circle => (
                <CircleWithLabel
                    key={circle.id}
                    x={circle.x}
                    y={circle.y}
                    size={circle.size}
                    color={circle.color}
                    label={circle.label} // Pass the label prop
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        gap: 20,
        alignItems: "center",
        textAlign: "center",
        padding: 20,
        backgroundColor: "#0c370f",
    },
    imageBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        flex: 1,
        width: '100%', // Explicitly setting width/height also works
        height: '100%',
    },
    testGame: {
        position: 'absolute',
        top: 0,
        left: 0,
    }
})
