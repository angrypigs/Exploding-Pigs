import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SocketProvider } from './contexts/socketContext';

import CreateRoomScreen from './ui/Screens/createRoomScreen';
import GameScreen from './ui/Screens/gameScreen';
import HomeScreen from './ui/Screens/homeScreen';
import JoinRoomScreen from './ui/Screens/joinRoomScreen';
import RoomScreen from './ui/Screens/roomScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <SocketProvider>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Home"
                    screenOptions={{ headerShown: false }}
                    id={'x'}
                >
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Room" component={RoomScreen} />
                    <Stack.Screen name="JoinRoom" component={JoinRoomScreen} />
                    <Stack.Screen
                        name="CreateRoom"
                        component={CreateRoomScreen}
                    />
                    <Stack.Screen name="Game" component={GameScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </SocketProvider>
    );
}
