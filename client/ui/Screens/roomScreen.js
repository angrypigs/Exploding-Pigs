import { useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
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
    const [readyFlag, setReadyFlag] = useState(false);

    useEffect(() => {
        socket.on('refreshRoom', (newPlayers, ready) => {
            if (newPlayers) setPlayers(newPlayers);
            setReadyFlag(ready);
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
        <LinearGradient
            colors={['#1a7c20', '#093c0d']}
            start={{ x: 0.5, y: 0.5 }}
            end={{ x: 1, y: 1 }}
            style={stylesMain.container}
        >
            <LinearGradient
                colors={['#062608', '#093c0d']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <Text style={stylesMain.text}>Game Room: {roomCode}</Text>
                <Text style={stylesMain.text}>Nickname: {nickname}</Text>
                {name ? <Text style={stylesMain.text}>Name: {name}</Text> : null}
            </LinearGradient>
            <RoomPlayerList players={players} setPlayers={setPlayers} />
            <Button
                title="Ready"
                onPress={handlePlayerReady}
                colors={readyFlag ? undefined : ['#b70e0e', '#ce1616']}
            />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: '10%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 5,
        borderRadius: 10,
        borderColor: '#031803',
    },
});
