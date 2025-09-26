import { SocketContext } from "../contexts/socketContext";
import React, { useState, useContext, useEffect } from "react";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";


export default function RoomScreen({ navigator }) {
  const socket = useContext(SocketContext);

  const route = useRoute();
  const { roomCode } = route.params;

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Game Room</Text>
        <Text style={styles.title}>Room code: {roomCode}</Text>
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
});