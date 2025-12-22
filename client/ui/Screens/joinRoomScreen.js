import { useContext, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SocketContext } from '../../contexts/socketContext';
import { stylesMain } from '../../styles/stylesMain';
import { isGameCode } from '../../utils';
import { Button } from '../components/button';

export default function JoinRoomScreen({ navigation }) {
    const [screen, setScreen] = useState('menu');
    const socket = useContext(SocketContext);

    const [inputs, setInputs] = useState({
        joinCode: '',
        joinNickname: '',
        joinName: '',
    });

    const handleRoomJoin = () => {
        if (isGameCode(inputs.joinCode)) {
            if (inputs.joinNickname) {
                socket.emit('joinRoom', inputs.joinCode, inputs.joinNickname, inputs.joinName);
            } else {
                Alert.alert('', 'Nickname is necessary');
                console.log('Nickname is necessary');
            }
        } else {
            Alert.alert('', 'Code must consist of five digits');
            console.log('Code must consist of five digits');
        }
    };

    const handleSkip = () => {
        inputs.joinCode = '00000';
        inputs.joinNickname = 'B_USER JOIN';
        handleRoomJoin();
    };

    return (
        <View style={stylesMain.container}>
            <View style={stylesMain.subcontainer}>
                <Text style={stylesMain.text}>Join Room</Text>
                <TextInput
                    style={stylesMain.input}
                    value={inputs.joinCode}
                    onChangeText={text => setInputs({ ...inputs, joinCode: text })}
                    placeholder="Room code"
                />
                <TextInput
                    style={stylesMain.input}
                    value={inputs.joinNickname}
                    onChangeText={text => setInputs({ ...inputs, joinNickname: text })}
                    placeholder="Nickname"
                />
                <TextInput
                    style={stylesMain.input}
                    value={inputs.joinName}
                    onChangeText={text => setInputs({ ...inputs, joinName: text })}
                    placeholder="Name {optional}"
                />
                <TouchableOpacity style={stylesMain.test} onPress={handleSkip}>
                    <Text style={stylesMain.testText}>Skip</Text>
                </TouchableOpacity>
                <Button title="Join Room" onPress={handleRoomJoin} />
                <Button title="Home" onPress={() => navigation.navigate('Home')} />
            </View>
        </View>
    );
}
