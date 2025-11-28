import { useRoute } from '@react-navigation/native';
import { useContext, useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    ImageBackground,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import uuid from 'react-native-uuid';
import { SocketContext } from '../../contexts/socketContext';

import { Button } from 'react-native-web';
import { stylesMain } from '../../styles/style_main';
import AnimatedCard from '../components/animatedCard';
import Card from '../components/card';

const { width, height } = Dimensions.get('window');

const coords = {
    thrown: { x: width / 2 + 100, y: height - 100 },
    deck: { x: width / 2, y: height / 2 },
    card: {
        x: c => width / 2 - 200 + c * 50,
        y: p => height - 130 * (p + 1),
    },
};

function coordsAnimHandler(target) {
    if (target === 'thrown' || target === 'deck') return { ...coords[target] };
    let points = target.split(':').map(Number);
    return { x: coords.card.x(0), y: coords.card.y(points[0]) };
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

    const scrollRef = useRef(null); // Ref for the ScrollView
    const scrollIntervalRef = useRef(null); // Ref for the setInterval
    const scrollXRef = useRef(0); // Ref to track current scrollX (avoids stale state in intervals)
    const contentWidthRef = useRef(0);
    const [scrollState, setScrollState] = useState({
        contentWidth: 0,
        containerWidth: 0,
        showLeft: false,
        showRight: false,
    });

    // Add this inside GameScreen
    const [isHandHovered, setIsHandHovered] = useState(false);
    const [hoveredCardIndex, setHoveredCardIndex] = useState(null);

    const updateArrowState = x => {
        setScrollState(prev => {
            const { contentWidth, containerWidth } = prev;
            const canScrollLeft = x > 0;
            // -1 to account for rounding errors
            const canScrollRight = x < contentWidth - containerWidth - 1;

            return {
                ...prev,
                showLeft: canScrollLeft,
                showRight: canScrollRight,
            };
        });
    };

    const startScrolling = direction => {
        // Clear any existing interval
        if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);

        // Set a new interval to scroll repeatedly
        scrollIntervalRef.current = setInterval(() => {
            const SCROLL_STEP = 15; // How many pixels to scroll each step
            let newX;

            if (direction === 'left') {
                newX = Math.max(0, scrollXRef.current - SCROLL_STEP);
            } else {
                newX = scrollXRef.current + SCROLL_STEP;
            }

            if (scrollRef.current) {
                scrollRef.current.scrollTo({ x: newX, animated: false });
            }
        }, 50); // Adjust interval time (in ms) for speed
    };

    const stopScrolling = () => {
        if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
        }
    };

    // Add cleanup effect for the interval
    useEffect(() => {
        return () => {
            // Clear interval when component unmounts
            if (scrollIntervalRef.current) {
                clearInterval(scrollIntervalRef.current);
            }
        };
    }, []);

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
        const PADDING = 30; // How far from the edge the circles should be
        const LABEL_HEIGHT_APPROX = 20; // Approximate height of the text label for vertical positioning

        // 1. Generate 2 circles on the LEFT wall
        for (let i = 1; i <= 2; i++) {
            circles.push({
                id: `left-${i}`,
                x: PADDING,
                // Adjust Y to account for the label's height below the circle
                y: (height / 3) * i - CIRCLE_SIZE / 2 - LABEL_HEIGHT_APPROX / 2,
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
                x: (width / 4) * i - CIRCLE_SIZE / 2,
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
                y: (height / 3) * i - CIRCLE_SIZE / 2 - LABEL_HEIGHT_APPROX / 2,
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
            if (cards_ref.current !== null) setCards(cards_ref.current);
            if (thrown_ref.current !== null) setThrown(thrown_ref.current);
            if (deck_ref.current !== null) setDeck(deck_ref.current);
        }
    }, [animTrigger]);

    useEffect(() => {
        socket.on('refreshGame', (newAnims, cards, deck, thrown, turn_data) => {
            if (turn_data) {
                setTurnPointer(turn_data);
            }
            cardsSelected_ref.current = [];
            setCardsSelected(false);

            if (newAnims === false) {
                console.warn('refreshGame odrzucony przez serwer');
                return;
            } else if (
                newAnims === null ||
                (Array.isArray(newAnims) && newAnims.length === 0)
            ) {
                console.log('Anims = null lub []');
                cards_ref.current = cards;
                thrown_ref.current = thrown;
                deck_ref.current = deck;
                setAnimTrigger(prev => !prev);
            } else {
                cards_ref.current = cards;
                thrown_ref.current = thrown;
                deck_ref.current = deck;

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
                console.log('Anims dostarczone:', newAnims);
                setAnims(prev => ({ ...(prev ?? {}), ...tempAnims }));
                setAnimTrigger(prev => !prev);
            }
        });

        return () => socket.off('refreshGame');
    }, [socket]);

    const handleTakeCard = () => {
        socket.emit('takeCard', roomCode);
    };

    const handleSelectCard = index => {
        if (cardsSelected_ref.current.includes(index)) {
            cardsSelected_ref.current = cardsSelected_ref.current.filter(
                i => i != index
            );
            //   console.log("usuwany");
        } else {
            cardsSelected_ref.current.push(index);
            //   console.log("dodawany");
        }
        // console.log(`selected ${cardsSelected_ref.current}`);
        setCardsSelected(cardsSelected_ref.current.length !== 0);
    };

    const handleThrowCard = () => {
        socket.emit('throwCard', roomCode, cardsSelected_ref.current);
        cardsSelected_ref.current = [];
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
        <View style={styles.container}>
            <ImageBackground
                source={require('../../assets/pig-nose-svgrepo-com.png')} // Or use {uri: 'https://...'}} for a network image
                resizeMode="repeat" // 'cover', 'contain', 'stretch', 'repeat', 'center'
                style={styles.imageBackground}
            ></ImageBackground>

            <View style={stylesMain.testGame}>
                <Text style={stylesMain.text}>Room code: {roomCode}</Text>
                <Text style={stylesMain.text}>Nickname: {nickname}</Text>
                {turnPointer && (
                    <Text style={stylesMain.text}>
                        Turn for player {turnPointer[0]}
                        {'\n'} ({turnPointer[1]} turns)
                    </Text>
                )}
            </View>

            {thrown && (
                <Card
                    type={thrown}
                    onPress={() => console.log(thrown)}
                    coords={[coords.thrown.x, coords.thrown.y]}
                    style={{ zIndex: 50 }}
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
            {cardsSelected && (
                <Button
                    title="Throw Selected Cards"
                    onPress={handleThrowCard}
                />
            )}

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

            <View style={[styles.myHandContainer]}>
                {/* --- ADD LEFT ARROW --- */}
                {scrollState.showLeft && (
                    <Pressable
                        style={[styles.arrowContainer, styles.arrowLeft]}
                        onPressIn={() => startScrolling('left')}
                        onPressOut={stopScrolling}
                        onHoverIn={() => startScrolling('left')} // For react-native-web
                        onHoverOut={stopScrolling} // For react-native-web
                    >
                        <Text style={styles.arrowText}>{'<'}</Text>
                    </Pressable>
                )}

                <ScrollView
                    ref={scrollRef}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    // ensure overflow is visible so the card doesn't get cut off when it moves up
                    contentContainerStyle={[
                        styles.myHandContent,
                        isHandHovered && { height: 1000 },
                    ]}
                    style={{ overflow: 'visible' }}
                    scrollEventThrottle={16}
                    onScroll={event => {
                        const x = event.nativeEvent.contentOffset.x;
                        scrollXRef.current = x;
                        updateArrowState(x);
                    }}
                    onContentSizeChange={(newWidth, height) => {
                        // ... (your existing logic)
                        const oldWidth = contentWidthRef.current;
                        if (newWidth > oldWidth && scrollRef.current) {
                            stopScrolling();
                            scrollRef.current.scrollToEnd({ animated: true });
                        }
                        contentWidthRef.current = newWidth;
                        setScrollState(prev => {
                            const canScrollRight =
                                newWidth > prev.containerWidth;
                            return {
                                ...prev,
                                contentWidth: newWidth,
                                showRight: canScrollRight,
                            };
                        });
                    }}
                    onLayout={event => {
                        setScrollState(prev => ({
                            ...prev,
                            containerWidth: event.nativeEvent.layout.width,
                        }));
                    }}
                >
                    {cards?.[0]?.map((c, i) => {
                        const isThisCardHovered = hoveredCardIndex === i;

                        return (
                            <Pressable
                                key={`0-${i}`}
                                // We keep these to handle the container height,
                                // but we WON'T use them for the individual card movement anymore.
                                onHoverIn={() => {
                                    setIsHandHovered(true);
                                    setHoveredCardIndex(i);
                                }}
                                onHoverOut={() => {
                                    setIsHandHovered(false);
                                    setHoveredCardIndex(null);
                                }}
                                // *** SOLUTION: Use a function for style to get the 'hovered' state directly ***
                                style={({ hovered }) => [
                                    {
                                        // Center content
                                        justifyContent: 'center',
                                        height: '100%',

                                        // WEB ONLY: Smooth animation for transform AND margin
                                        transition: 'all 0.3s ease-out',

                                        // Dynamic styles based on the 'hovered' argument passed by Pressable
                                        marginHorizontal: hovered ? 30 : 0,
                                        zIndex: hovered ? 100 : 1,
                                        transform: [
                                            { translateY: hovered ? -100 : 0 },
                                        ],
                                    },
                                ]}
                            >
                                <Card
                                    key={`0-${i}`}
                                    type={c}
                                    onPress={() => handleSelectCard(i)}
                                    coords={[
                                        coords.card.x(i),
                                        coords.card.y(0),
                                    ]}
                                    zoom={true}
                                />
                            </Pressable>
                        );
                    })}
                </ScrollView>

                {/* --- ADD RIGHT ARROW --- */}
                {scrollState.showRight && (
                    <Pressable
                        style={[styles.arrowContainer, styles.arrowRight]}
                        onPressIn={() => startScrolling('right')}
                        onPressOut={stopScrolling}
                        onHoverIn={() => startScrolling('right')} // For react-native-web
                        onHoverOut={stopScrolling} // For react-native-web
                    >
                        <Text style={styles.arrowText}>{'>'}</Text>
                    </Pressable>
                )}
            </View>

            {anims &&
                Object.entries(anims).map(([uuid, animData]) => (
                    <AnimatedCard
                        key={uuid}
                        animData={animData}
                        onFinish={() => removeAnim(uuid)}
                    />
                ))}
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
        width: '100%', // Explicitly setting width/height also works
        height: '100%',
    },
    testGame: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    myHandContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        height: 150,
        // Add flexDirection to allow arrows to be on the side
        flexDirection: 'row',
        alignItems: 'center',
    },
    myHandContent: {
        // ... (keep your existing myHandContent styles)
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 150,
    },
    handCard: {
        width: 80,
        height: 120,
        marginHorizontal: 4,
    },

    // --- ADD THESE NEW STYLES ---
    arrowContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 40, // Width of the arrow touch area
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background
        zIndex: 10, // Make sure it's on top of cards
    },
    arrowLeft: {
        left: 0,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    arrowRight: {
        right: 0,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    arrowText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
});
