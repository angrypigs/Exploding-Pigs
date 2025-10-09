import {View, Text, FlatList} from 'react-native';

import { stylesPlayerList } from '../../styles/style_custom_components';

export function PlayerList({ players }) {

    const renderItem = ({ item }) => (
        <View style={stylesPlayerList.tile}>
        <Text style={stylesPlayerList.text}>{item.nickname}</Text>
        </View>
    );

    return (
        <FlatList
        data={players}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={stylesPlayerList.background}
        />
    );
}