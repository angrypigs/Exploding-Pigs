import { FlatList, Text, View } from 'react-native';

import { stylesPlayerList } from '../../styles/stylesCustomComponents';

export function RoomPlayerList({ players }) {
    const renderItem = ({ item }) => (
        <View style={stylesPlayerList.tile}>
            <Text style={stylesPlayerList.text}>{item.nickname}</Text>
        </View>
    );

    return (
        <FlatList
            data={players}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={stylesPlayerList.background}
        />
    );
}
