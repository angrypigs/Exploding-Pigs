import { useMemo } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { stylesMain } from '../../styles/stylesMain';

const stringToColor = str => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
};

export default function PlayerList({
    cards = {},
    turnPointer = null,
    showSelf = false,
    vertical = false,
    onSelect,
}) {
    const displayPlayers = useMemo(() => {
        if (!cards) return [];

        const sorted = Object.entries(cards)
            .map(([key, data]) => ({
                ...data,
                relativeId: key,
            }))
            .sort((a, b) => parseInt(a.relativeId) - parseInt(b.relativeId));

        if (!showSelf) {
            return sorted.filter(p => p.relativeId !== '0');
        }
        return sorted;
    }, [cards, showSelf]);

    const activePublicId = turnPointer ? turnPointer[2] : null;

    return (
        <View
            style={[
                styles.container,
                vertical ? styles.containerVertical : styles.containerHorizontal,
            ]}
        >
            <ScrollView
                horizontal={!vertical}
                showsHorizontalScrollIndicator={!vertical}
                showsVerticalScrollIndicator={vertical}
                contentContainerStyle={
                    vertical ? styles.scrollContentVertical : styles.scrollContentHorizontal
                }
                persistentScrollbar={Platform.OS === 'web'}
            >
                {displayPlayers.map((player, index) => {
                    const isTurn = activePublicId && player.publicId === activePublicId;
                    const cardCount = player.hand ? player.hand.length : 0;
                    const avatarColor = stringToColor(player.nickname || 'Guest');

                    return (
                        <Pressable
                            key={`${player.publicId || player.nickname}-${index}`}
                            onPress={() => onSelect && onSelect(player)}
                            style={({ pressed }) => [
                                styles.playerItem,
                                vertical ? styles.playerItemVertical : styles.playerItemHorizontal,
                                isTurn && styles.turnActiveItem,
                                pressed && styles.pressedItem,
                            ]}
                        >
                            <View style={[styles.avatarBox, { backgroundColor: avatarColor }]}>
                                <Text style={styles.avatarLetter}>
                                    {player.nickname
                                        ? player.nickname.charAt(0).toUpperCase()
                                        : '?'}
                                </Text>
                            </View>

                            <View style={styles.infoBox}>
                                <Text
                                    style={[stylesMain.text, styles.nicknameText]}
                                    numberOfLines={1}
                                >
                                    {player.nickname}
                                </Text>

                                <View style={styles.cardCountBox}>
                                    <View style={styles.miniCardIcon} />
                                    <Text style={[stylesMain.text, styles.countText]}>
                                        {cardCount}
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { position: 'relative' },
    containerHorizontal: {
        height: 110,
        width: '100%',
    },
    containerVertical: {
        maxHeight: 300,
        width: '100%',
    },
    scrollContentHorizontal: {
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
    },
    scrollContentVertical: {
        paddingVertical: 5,
        paddingHorizontal: 5,
    },
    playerItem: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 12,
        padding: 8,
        margin: 5,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    playerItemHorizontal: {
        width: 100,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playerItemVertical: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 60,
    },
    turnActiveItem: {
        borderColor: '#fbbf24',
        backgroundColor: 'rgba(251, 191, 36, 0.2)',
        shadowColor: '#fbbf24',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 5,
    },
    pressedItem: {
        opacity: 0.8,
    },
    avatarBox: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        width: 30,
        height: 30,
        marginBottom: 4,
    },
    avatarLetter: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    infoBox: {
        alignItems: 'center',
        flex: 1,
    },
    nicknameText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    cardCountBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
        opacity: 0.9,
    },
    miniCardIcon: {
        width: 10,
        height: 14,
        backgroundColor: '#eee',
        borderRadius: 2,
        marginRight: 4,
        borderWidth: 1,
        borderColor: '#333',
    },
    countText: {
        fontSize: 12,
        color: '#ddd',
    },
});
