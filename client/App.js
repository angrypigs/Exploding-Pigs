import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

export default function App() {
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    socket.on("gameState", (state) => setGameState(state));
    return () => socket.off("gameState");
  }, []);

  const moveLeft = () => socket.emit("playerAction", "MOVE_LEFT");
  const moveRight = () => socket.emit("playerAction", "MOVE_RIGHT");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Moja gra multiplayer</Text>

      <View style={styles.buttons}>
        <Button title="←" onPress={moveLeft} />
        <Button title="→" onPress={moveRight} />
      </View>

      <Text style={styles.stateTitle}>Stan gry:</Text>
      <Text>{JSON.stringify(gameState, null, 2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  buttons: { flexDirection: "row", marginBottom: 20, gap: 10 },
  stateTitle: { fontSize: 18, marginBottom: 10 },
});