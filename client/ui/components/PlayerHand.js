import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Card from './card';

export default function PlayerHand({ cards, selectedCards, onSelectCard }) {
    const [hoveredCardIndex, setHoveredCardIndex] = useState(null);

    return (
        <View style={styles.myHandContainer} pointerEvents="box-none">
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={true}
                persistentScrollbar={Platform.OS === 'web'}
                contentContainerStyle={styles.myHandContent}
                style={{ flex: 1 }}
            >
                {cards?.hand.map((c, i) => {
                    return (
                        <Pressable
                            key={`hand-${i}`}
                            onHoverIn={() => setHoveredCardIndex(i)}
                            onHoverOut={() => setHoveredCardIndex(null)}
                            onPress={() => onSelectCard(i)}
                            style={styles.cardWrapper}
                        >
                            <View style={[styles.innerCardContainer]}>
                                <Card
                                    type={c}
                                    onPress={() => onSelectCard(i)}
                                    zoom={true}
                                    isChosen={selectedCards.includes(i)}
                                />
                            </View>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    myHandContainer: {
        position: 'relative',
        height: 220,
        paddingHorizontal: 20,
        zIndex: 100,
        maxWidth: '100%',
        width: '100%',
    },
    myHandContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingBottom: 30,
        paddingTop: 20,
        paddingRight: 20,
    },
    cardWrapper: {
        width: 100,
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    innerCardContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
