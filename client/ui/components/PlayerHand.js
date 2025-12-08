import React, { useRef, useState, useEffect } from 'react';
import { View, ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import Card from './card'; // Adjust path
import { coords } from '../utils/gameUtils';

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

    // Scroll Logic
    const updateArrowState = x => {
        setScrollState(prev => {
            const { contentWidth, containerWidth } = prev;
            return {
                ...prev,
                showLeft: x > 0,
                showRight: x < contentWidth - containerWidth - 1,
            };
        });
    };

    const startScrolling = direction => {
        if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = setInterval(() => {
            const SCROLL_STEP = 15;
            let newX = direction === 'left'
                ? Math.max(0, scrollXRef.current - SCROLL_STEP)
                : scrollXRef.current + SCROLL_STEP;

            if (scrollRef.current) {
                scrollRef.current.scrollTo({ x: newX, animated: false });
            }
        }, 50);
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
        <View style={styles.myHandContainer}>
            {scrollState.showLeft && (
                <Pressable
                    style={[styles.arrowContainer, styles.arrowLeft]}
                    onPressIn={() => startScrolling('left')}
                    onPressOut={stopScrolling}
                    onHoverIn={() => startScrolling('left')}
                    onHoverOut={stopScrolling}
                >
                    <Text style={styles.arrowText}>{'<'}</Text>
                </Pressable>
            )}

            <ScrollView
                ref={scrollRef}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.myHandContent, isHandHovered && { height: 1000 }]}
                style={{ overflow: 'visible' }}
                scrollEventThrottle={16}
                onScroll={event => {
                    scrollXRef.current = event.nativeEvent.contentOffset.x;
                    updateArrowState(scrollXRef.current);
                }}
                onContentSizeChange={(newWidth) => {
                    const oldWidth = contentWidthRef.current;
                    if (newWidth > oldWidth && scrollRef.current) {
                        stopScrolling();
                        scrollRef.current.scrollToEnd({ animated: true });
                    }
                    contentWidthRef.current = newWidth;
                    setScrollState(prev => ({
                        ...prev,
                        contentWidth: newWidth,
                        showRight: newWidth > prev.containerWidth,
                    }));
                }}
                onLayout={event => {
                    setScrollState(prev => ({
                        ...prev,
                        containerWidth: event.nativeEvent.layout.width,
                    }));
                }}
            >
                {cards?.map((c, i) => (
                    <Pressable
                        key={`0-${i}`}
                        onHoverIn={() => { setIsHandHovered(true); setHoveredCardIndex(i); }}
                        onHoverOut={() => { setIsHandHovered(false); setHoveredCardIndex(null); }}
                        style={({ hovered }) => [{
                            justifyContent: 'center',
                            height: '100%',
                            transition: 'all 0.3s ease-out',
                            marginHorizontal: hovered ? 30 : 0,
                            zIndex: hovered ? 100 : 1,
                            transform: [{ translateY: hovered ? -100 : 0 }],
                        }]}
                    >
                        <Card
                            type={c}
                            onPress={() => onSelectCard(i)}
                            coords={[coords.card.x(i), coords.card.y(0)]}
                            zoom={true}
                            isChosen={selectedCards.includes(i)}
                        />
                    </Pressable>
                ))}
            </ScrollView>

            {scrollState.showRight && (
                <Pressable
                    style={[styles.arrowContainer, styles.arrowRight]}
                    onPressIn={() => startScrolling('right')}
                    onPressOut={stopScrolling}
                    onHoverIn={() => startScrolling('right')}
                    onHoverOut={stopScrolling}
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
        bottom: 20,
        left: 0,
        right: 0,
        height: 150,
        flexDirection: 'row',
        alignItems: 'center',
    },
    myHandContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 150,
    },
    arrowContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 10,
    },
    arrowLeft: { left: 0, borderTopRightRadius: 10, borderBottomRightRadius: 10 },
    arrowRight: { right: 0, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 },
    arrowText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
});