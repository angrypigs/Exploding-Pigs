import { SocketContext } from "../contexts/socketContext";
import React, { useState, useContext, useEffect } from "react";
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";


export default function RoomScreen({ navigation }) {
    const socket = useContext(SocketContext);

    const route = useRoute();
    const { roomCode, nickname, name } = route.params;

    const [players, setPlayers] = useState([]);

    useEffect(() => {
        socket.on("refreshRoom", (newPlayers) => {
            if (newPlayers) setPlayers(newPlayers);
        });
        return () => socket.off("refreshRoom");
        }, [socket]);
    
    socket.emit("refreshRoom", roomCode);

    function PlayerList({ players }) {

    const renderItem = ({ item }) => (
        <View style={styles.tile}>
        <Text style={styles.nickname}>{item.nickname}</Text>
        </View>
    );

    return (
        <FlatList
        data={players}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        />
    );
    }

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Game Room</Text>
        <Text style={styles.title}>Room code: {roomCode}</Text>
        <Text style={styles.title}>Nickname: {nickname}</Text>
        {name ? <Text style={styles.title}>Name: {name}</Text> : null}
        <PlayerList players={players} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  tile: {
    backgroundColor: "#a3d9ff",
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  nickname: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#004466",
  },
});