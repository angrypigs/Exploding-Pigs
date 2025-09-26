import { SocketContext } from "../contexts/socketContext";
import React, { useState, useContext, useEffect } from "react";
import { View, Text, Button, TextInput, StyleSheet, Alert } from "react-native";
import { isGameCode } from "../utils"


export default function HomeScreen({ navigation }) {
  const [screen, setScreen] = useState("menu");
  const [inputs, setInputs] = useState({ 
    joinCode: "",
    joinNickname: "",
    joinName: "",
    createMaxPlayers: "",
    createNickname: "",
    createName: "",
  });
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on("joinRoom", (code, nickname, name) => {
        if (code) {
            navigation.navigate("Room", {roomCode: code, nickname, name});
        } else {
            console.log(`Error while joining the room: ${nickname}`);
        }
    });
    return () => socket.off("joinRoom");
  }, [socket]);

  const handleRoomCreate = () => {
    const parsedMP = Number(inputs.createMaxPlayers);
    if (!isNaN(parsedMP) && parsedMP > 1 && parsedMP < 9) {
        if (inputs.createNickname) {
            socket.emit("createRoom", 
                inputs.createMaxPlayers, 
                inputs.createNickname, 
                inputs.createName)
        } else {
            Alert.alert("", "Nickname is necessary");
            console.log("Nickname is necessary");
        }
    } else {
        Alert.alert("", "Max players must be a number between 2 and 8");
        console.log("Max players must be a number between 2 and 8");
    }
  }

  const handleRoomJoin = () => {
    if (isGameCode(inputs.joinCode)) {
        if (inputs.joinNickname) {
            socket.emit("joinRoom", 
                inputs.joinCode, 
                inputs.joinNickname, 
                inputs.joinName)
        } else {
            Alert.alert("", "Nickname is necessary");
            console.log("Nickname is necessary");
        }
    } else {
        Alert.alert("", "Code must consist of five digits");
        console.log("Code must consist of five digits");
    }
  }

  return (
    <View style={styles.container}>
      {screen === "menu" && (
        <>
          <Text style={styles.title}>Exploding Pigs</Text>
          <Button title="Join Room" onPress={() => setScreen("joinRoom")} />
          <Button title="Create Room" onPress={() => setScreen("createRoom")} />
        </>
      )}

      {screen === "joinRoom" && (
        <View>
          <Text style={styles.title}>Join Room</Text>
          <TextInput style={styles.input} 
          value={inputs.joinCode}  
          onChangeText={(text) => setInputs({ ...inputs, joinCode: text })}
          placeholder="Room code"  />
          <TextInput style={styles.input} 
          value={inputs.joinNickname}  
          onChangeText={(text) => setInputs({ ...inputs, joinNickname: text })}
          placeholder="Nickname" />
          <TextInput style={styles.input} 
          value={inputs.joinName}  
          onChangeText={(text) => setInputs({ ...inputs, joinName: text })}
          placeholder="Name {optional}" />
          <Button title="Join Room" onPress={handleRoomJoin} />
          <Button title="Home" onPress={() => setScreen("menu")} />
        </View>
      )}

      {screen === "createRoom" && (
        <View>
          <Text style={styles.title}>Create Room</Text>
          <TextInput style={styles.input} 
          value={inputs.createMaxPlayers}  
          onChangeText={(text) => setInputs({ ...inputs, createMaxPlayers: text })}
          placeholder="Max players {between 2 and 8}"  />
          <TextInput style={styles.input} 
          value={inputs.createNickname}  
          onChangeText={(text) => setInputs({ ...inputs, createNickname: text })}
          placeholder="Nickname" />
          <TextInput style={styles.input} 
          value={inputs.createName}  
          onChangeText={(text) => setInputs({ ...inputs, createName: text })}
          placeholder="Name {optional}" />
          <Button title="Create Room" onPress={handleRoomCreate} />
          <Button title="Home" onPress={() => setScreen("menu")} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
    alignItems: "center",
    textAlign: "center",
    padding: 20,
    backgroundColor: "rgba(143, 143, 143, 1)", 
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 5,
    width: 200,
    borderRadius: 8,
    backgroundColor: "white",
  },
});