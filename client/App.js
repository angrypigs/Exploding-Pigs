import { SocketProvider } from "./contexts/socketContext";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./scenes/homeScreen";
import RoomScreen from "./scenes/room";
import GameScreen from "./scenes/game";

const Stack = createNativeStackNavigator();


export default function App() {

  return (
    <SocketProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Room" component={RoomScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SocketProvider>
  );
}
