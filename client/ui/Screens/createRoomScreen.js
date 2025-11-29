import { useContext, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SocketContext } from '../../contexts/socketContext';
import { stylesMain } from '../../styles/style_main';
import { Button } from '../components/button';

export default function CreateRoomScreen({ navigation }) {
    const [screen, setScreen] = useState('menu');
    const socket = useContext(SocketContext);

    const [inputs, setInputs] = useState({
        createMaxPlayers: '',
        createNickname: '',
        createName: '',
    });

    const handleRoomCreate = () => {
        const parsedMP = Number(inputs.createMaxPlayers);
        if (!isNaN(parsedMP) && parsedMP > 1 && parsedMP < 9) {
            if (inputs.createNickname) {
                socket.emit(
                    'createRoom',
                    inputs.createMaxPlayers,
                    inputs.createNickname,
                    inputs.createName
                );
            } else {
                Alert.alert('', 'Nickname is necessary');
                console.log('Nickname is necessary');
            }
        } else {
            Alert.alert('', 'Max players must be a number between 2 and 8');
            console.log('Max players must be a number between 2 and 8');
        }
    };

    const handleSkip = () => {
        inputs.createMaxPlayers = '8';
        inputs.createNickname = 'A_USER CREATE';
        handleRoomCreate();
    };

    return (
        <View style={stylesMain.container}>
            <View style={stylesMain.subcontainer}>
                <Text style={stylesMain.text}>Create Room</Text>
                <TextInput
                    style={stylesMain.input}
                    value={inputs.createMaxPlayers}
                    onChangeText={text => setInputs({ ...inputs, createMaxPlayers: text })}
                    placeholder="Max players {between 2 and 8}"
                />
                <TextInput
                    style={stylesMain.input}
                    value={inputs.createNickname}
                    onChangeText={text => setInputs({ ...inputs, createNickname: text })}
                    placeholder="Nickname"
                />
                <TextInput
                    style={stylesMain.input}
                    value={inputs.createName}
                    onChangeText={text => setInputs({ ...inputs, createName: text })}
                    placeholder="Name {optional}"
                />
                <TouchableOpacity style={stylesMain.test} onPress={handleSkip}>
                    <Text style={stylesMain.testText}>Skip</Text>
                </TouchableOpacity>
                <Button title="Create Room" onPress={handleRoomCreate} />
                <Button title="Home" onPress={() => navigation.navigate('Home')} />
            </View>
        </View>
    );
}
