import { useRoute } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SocketContext } from '../../contexts/socketContext';

import { stylesMain } from '../../styles/stylesMain';
import { Button } from '../components/button';
import { RoomPlayerList } from '../components/roomPlayerList';

export default function RoomScreen({ navigation }) {
    const socket = useContext(SocketContext);
    const route = useRoute();
    const { roomCode, nickname, name } = route.params;

    const handlePlayerReady = () => {
        socket.emit('playerReady', roomCode);
    };

    const [players, setPlayers] = useState([]);

    useEffect(() => {
        socket.on('refreshRoom', newPlayers => {
            if (newPlayers) setPlayers(newPlayers);
        });
        return () => socket.off('refreshRoom');
    }, [socket]);

    useEffect(() => {
        socket.on('roomReady', () => {
            navigation.replace('Game', { roomCode: roomCode, nickname, name });
        });
        return () => socket.off('roomReady');
    }, [socket]);

    socket.emit('refreshRoom', roomCode);

    return (
        <View style={stylesMain.container}>
            <View style={stylesMain.header}>
                <Text style={stylesMain.text}>Game Room {roomCode}</Text>
                <Text style={stylesMain.text}>Nickname: {nickname}</Text>
                {name ? <Text style={stylesMain.text}>Name: {name}</Text> : null}
            </View>
            <RoomPlayerList players={players} setPlayers={setPlayers} />
            <Button title="Ready" onPress={handlePlayerReady} />
        </View>
    );
}
