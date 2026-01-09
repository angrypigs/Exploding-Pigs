import { useContext } from 'react';
import { Text, View } from 'react-native';
import { SocketContext } from '../../contexts/socketContext';

import { stylesMain } from '../../styles/stylesMain';
import { Button } from '../components/button';

export default function GameOverScreen({ navigation, route }) {
    const socket = useContext(SocketContext);

    const { isWon, winner } = route.params || {};

    const handleExitGame = () => {
        socket.disconnect();
        socket.removeAllListeners();
        socket.connect();

        navigation.navigate('Home');
    };

    return (
        <View style={stylesMain.container}>
            <Text style={stylesMain.text}>{`You ${isWon ? 'Won' : 'Lost'}!`}</Text>
            {!isWon && winner && <Text style={stylesMain.text}>{`Winner: ${winner}`}</Text>}
            <Button title="Go to menu" onPress={handleExitGame} />
        </View>
    );
}
