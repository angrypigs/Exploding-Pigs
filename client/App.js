import {SocketProvider} from "./contexts/socketContext";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

import HomeScreen from "./ui/Screens/homeScreen";
import RoomScreen from "./ui/Screens/roomScreen";
import GameScreen from "./ui/Screens/gameScreen";
import JoinRoomScreen from "./ui/Screens/joinRoomScreen";
import CreateRoomScreen from "./ui/Screens/createRoomScreen";

const Stack = createNativeStackNavigator();

export default function App() {

    return (
        <SocketProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown: false}} id={"x"}>
                    <Stack.Screen name="Home" component={HomeScreen}/>
                    <Stack.Screen name="Room" component={RoomScreen}/>
                    <Stack.Screen name="JoinRoom" component={JoinRoomScreen}/>
                    <Stack.Screen name="CreateRoom" component={CreateRoomScreen}/>
                    <Stack.Screen name="Game" component={GameScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
        </SocketProvider>
    );
}
