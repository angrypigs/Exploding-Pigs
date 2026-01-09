import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// 1. Import biblioteki
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { SocketProvider } from './contexts/socketContext';
import CreateRoomScreen from './ui/Screens/createRoomScreen';
import GameOverScreen from './ui/Screens/gameOverScreen';
import GameScreen from './ui/Screens/gameScreen';
import HomeScreen from './ui/Screens/homeScreen';
import JoinRoomScreen from './ui/Screens/joinRoomScreen';
import RoomScreen from './ui/Screens/roomScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <SafeAreaProvider>
            <SocketProvider>
                <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
                    <NavigationContainer>
                        <Stack.Navigator
                            initialRouteName="Home"
                            screenOptions={{ headerShown: false }}
                            id={'x'}
                        >
                            <Stack.Screen name="Home" component={HomeScreen} />
                            <Stack.Screen name="Room" component={RoomScreen} />
                            <Stack.Screen name="JoinRoom" component={JoinRoomScreen} />
                            <Stack.Screen name="CreateRoom" component={CreateRoomScreen} />
                            <Stack.Screen name="Game" component={GameScreen} />
                            <Stack.Screen name="GameOver" component={GameOverScreen} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </SafeAreaView>
            </SocketProvider>
        </SafeAreaProvider>
    );
}
