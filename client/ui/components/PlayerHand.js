import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Card from './card';

export default function PlayerHand({ cards, selectedCards, onSelectCard }) {
    const [isHandHovered, setIsHandHovered] = useState(false);
    const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
    const [scrollState, setScrollState] = useState({
        contentWidth: 0,
        containerWidth: 0,
        showLeft: false,
        showRight: false,
    });

    const scrollRef = useRef(null);
    const scrollIntervalRef = useRef(null);
    const scrollXRef = useRef(0);
    const contentWidthRef = useRef(0);

    const updateArrowState = x => {
        setScrollState(prev => {
            const { contentWidth, containerWidth } = prev;
            return {
                ...prev,
                showLeft: x > 5,
                showRight: x < contentWidth - containerWidth - 5,
            };
        });
    };

    const startScrolling = direction => {
        if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = setInterval(() => {
            const SCROLL_STEP = 20; // Zwiększyłem dla płynności
            let newX =
                direction === 'left'
                    ? Math.max(0, scrollXRef.current - SCROLL_STEP)
                    : scrollXRef.current + SCROLL_STEP;

            if (scrollRef.current) {
                scrollRef.current.scrollTo({ x: newX, animated: false }); // animated: false jest kluczowe przy setInterval
            }
        }, 30);
    };

    const stopScrolling = () => {
        if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
        }
    };

    useEffect(() => {
        return () => stopScrolling();
    }, []);

    return (
        <View style={styles.myHandContainer} pointerEvents="box-none">
            {scrollState.showLeft && (
                <Pressable
                    style={[styles.arrowContainer, styles.arrowLeft]}
                    onPressIn={() => startScrolling('left')}
                    onPressOut={stopScrolling}
                    onHoverIn={() => Platform.OS === 'web' && startScrolling('left')}
                    onHoverOut={() => Platform.OS === 'web' && stopScrolling()}
                >
                    <Text style={styles.arrowText}>{'<'}</Text>
                </Pressable>
            )}

            <ScrollView
                ref={scrollRef}
                horizontal={true}
                showsHorizontalScrollIndicator={Platform.OS === 'web'}
                contentContainerStyle={[
                    styles.myHandContent,
                    isHandHovered && { paddingBottom: 0 },
                ]}
                style={{ flex: 1 }}
                scrollEventThrottle={16}
                onScroll={event => {
                    scrollXRef.current = event.nativeEvent.contentOffset.x;
                    updateArrowState(scrollXRef.current);
                }}
                onContentSizeChange={(w, h) => {
                    contentWidthRef.current = w;
                    setScrollState(prev => ({
                        ...prev,
                        contentWidth: w,
                        showRight: w > prev.containerWidth,
                    }));
                }}
                onLayout={event => {
                    const width = event.nativeEvent.layout.width;
                    setScrollState(prev => ({
                        ...prev,
                        containerWidth: width,
                        showRight: prev.contentWidth > width,
                    }));
                }}
            >
                {cards?.hand.map((c, i) => {
                    const isHovered = hoveredCardIndex === i;
                    return (
                        <Pressable
                            key={`hand-${i}`}
                            onHoverIn={() => {
                                setIsHandHovered(true);
                                setHoveredCardIndex(i);
                            }}
                            onHoverOut={() => {
                                setIsHandHovered(false);
                                setHoveredCardIndex(null);
                            }}
                            onPressIn={() => {
                                setIsHandHovered(true);
                                setHoveredCardIndex(i);
                            }}
                            onPressOut={() => {
                                setIsHandHovered(false);
                                setHoveredCardIndex(null);
                            }}
                            onPress={() => onSelectCard(i)}
                            style={[styles.cardWrapper, isHovered && styles.cardWrapperHovered]}
                        >
                            <Card
                                type={c}
                                onPress={() => onSelectCard(i)}
                                zoom={true}
                                isChosen={selectedCards.includes(i)}
                            />
                        </Pressable>
                    );
                })}
            </ScrollView>

            {scrollState.showRight && (
                <Pressable
                    style={[styles.arrowContainer, styles.arrowRight]}
                    onPressIn={() => startScrolling('right')}
                    onPressOut={stopScrolling}
                    onHoverIn={() => Platform.OS === 'web' && startScrolling('right')}
                    onHoverOut={() => Platform.OS === 'web' && stopScrolling()}
                >
                    <Text style={styles.arrowText}>{'>'}</Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    myHandContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 350,
        zIndex: 100,
    },
    myHandContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingBottom: 20,
        paddingTop: 50,
    },
    cardWrapper: {
        width: 100,
        height: 140,
        marginHorizontal: -15,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    cardWrapperHovered: {
        zIndex: 100,
        transform: [{ translateY: -60 }],
        marginHorizontal: 10,
    },
    arrowContainer: {
        position: 'absolute',
        bottom: 20,
        height: 140,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 200,
    },
});
