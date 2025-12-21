import { useRoute } from '@react-navigation/native';
import { useContext, useEffect, useRef, useState } from 'react';
import { Button, ImageBackground, StyleSheet, Text, View } from 'react-native';
import uuid from 'react-native-uuid';

import { SocketContext } from '../../contexts/socketContext';
import { stylesMain } from '../../styles/style_main';
import AnimatedCard from '../components/animatedCard';
import Card from '../components/card';
import OtherPlayers from '../components/OtherPlayers';
import PlayerHand from '../components/PlayerHand';
import { coords, coordsAnimHandler } from '../utils/gameUtils';

export default function GameScreen({ navigation }) {
    const socket = useContext(SocketContext);
    const route = useRoute();
    const { roomCode, nickname } = route.params;

    const [cards, setCards] = useState({});
    const [cardsSelected, setCardsSelected] = useState([]);
    const [thrown, setThrown] = useState(null);
    const [deck, setDeck] = useState(null);
    const [anims, setAnims] = useState(null);
    const [animTrigger, setAnimTrigger] = useState(false);
    const [turnPointer, setTurnPointer] = useState(null);

    const cards_ref = useRef({});
    const thrown_ref = useRef(null);
    const deck_ref = useRef(null);

    useEffect(() => {
        if (anims === null) {
            if (cards_ref.current != null) setCards(cards_ref.current);
            if (thrown_ref.current != null) setThrown(thrown_ref.current);
            if (deck_ref.current != null) setDeck(deck_ref.current);
        }
    }, [animTrigger]);

    useEffect(() => {
        socket.on('refreshGame', (newAnims, s_cards, s_deck, s_thrown, turn_data) => {
            if (turn_data) setTurnPointer(turn_data);
            setCardsSelected([]);
            cards_ref.current = s_cards;
            thrown_ref.current = s_thrown;
            deck_ref.current = s_deck;
            console.log(s_thrown);
            if (!newAnims || (Array.isArray(newAnims) && newAnims.length === 0)) {
                setAnimTrigger(prev => !prev);
            } else {
                let tempAnims = {};
                for (const a of newAnims) {
                    if (a[0] === 'move') {
                        let c_start = coordsAnimHandler(a[1]);
                        let c_end = coordsAnimHandler(a[2]);
                        tempAnims[uuid.v4()] = {
                            type: 'move',
                            x: c_start.x,
                            y: c_start.y,
                            targetX: c_end.x,
                            targetY: c_end.y,
                            type: a[3],
                        };
                    }
                }
                setAnims(prev => ({ ...(prev ?? {}), ...tempAnims }));
                setAnimTrigger(prev => !prev);
            }
        });
        return () => socket.off('refreshGame');
    }, [socket]);

    const handleTakeCard = () => socket.emit('takeCard', roomCode);

    const handleSelectCard = index => {
        setCardsSelected(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const handleThrowCard = () => {
        socket.emit('throwCard', roomCode, cardsSelected);
        setCardsSelected([]);
    };

    const removeAnim = id => {
        setAnims(prev => {
            const next = { ...prev };
            delete next[id];
            if (Object.keys(next).length === 0) {
                setAnimTrigger(prev => !prev);
                return null;
            }
            return next;
        });
    };

    return (
        <View style={[stylesMain.container, { padding: 0, backgroundColor: '#0c370f' }]}>
            <ImageBackground
                source={require('../../assets/pig-nose-svgrepo-com.png')}
                resizeMode="repeat"
                style={styles.imageBackground}
            />

            {/* Game Info HUD */}
            <View style={stylesMain.testGame}>
                <Text style={stylesMain.text}>Room code: {roomCode}</Text>
                <Text style={stylesMain.text}>Nickname: {nickname}</Text>
                {turnPointer && (
                    <Text style={stylesMain.text}>
                        Turn for player {turnPointer[0]} ({turnPointer[1]} turns)
                    </Text>
                )}
            </View>

            {/* Central Table */}
            {thrown && (
                <Card
                    type={thrown}
                    onPress={() => {}}
                    coords={[coords.thrown.x, coords.thrown.y]}
                />
            )}

            {deck && (
                <Card
                    type={deck}
                    onPress={handleTakeCard}
                    coords={[coords.deck.x, coords.deck.y]}
                    zoom={false}
                />
            )}

            {/* Other Players (Walls) */}
            <OtherPlayers cards={cards} />

            {/* Player Hand (Bottom Scroll) */}
            <PlayerHand
                cards={cards?.[0]}
                selectedCards={cardsSelected}
                onSelectCard={handleSelectCard}
            />

            {/* Animation Overlay */}
            {anims &&
                Object.entries(anims).map(([uuid, animData]) => (
                    <AnimatedCard
                        key={uuid}
                        animData={animData}
                        onFinish={() => removeAnim(uuid)}
                    />
                ))}

            {/* Action Buttons */}
            {cardsSelected.length > 0 && (
                <Button title="Throw Selected Cards" onPress={handleThrowCard} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        gap: 20,
        alignItems: 'center',
        textAlign: 'center',
        padding: 20,
        backgroundColor: '#0c370f',
    },
    imageBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        flex: 1,
        width: '100%',
        height: '100%',
    },
});
