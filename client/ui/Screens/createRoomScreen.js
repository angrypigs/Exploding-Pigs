import {stylesMain} from "../../styles/style_main";
import {Alert, Text, TextInput, View, StyleSheet, TouchableOpacity} from "react-native";
import {Button} from "../components/button";
import React, {useContext, useState} from "react";
import {isGameCode} from "../../utils";
import {SocketContext} from "../../contexts/socketContext";

export default function CreateRoomScreen({navigation}) {
    const [screen, setScreen] = useState("menu");
    const socket = useContext(SocketContext);

    const [inputs, setInputs] = useState({
        createMaxPlayers: "",
        createNickname: "",
        createName: "",
    });

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

    const handleSkip = () => {
        inputs.createMaxPlayers = "8";
        inputs.createNickname = "A_USER CREATE"
        handleRoomCreate();
    }

    return (
        <View style={styles.container}>
            <View style={styles.subcontainer}>
                <Text style={styles.text}>Create Room</Text>
                <TextInput style={styles.input}
                           value={inputs.createMaxPlayers}
                           onChangeText={(text) => setInputs({...inputs, createMaxPlayers: text})}
                           placeholder="Max players {between 2 and 8}"/>
                <TextInput style={styles.input}
                           value={inputs.createNickname}
                           onChangeText={(text) => setInputs({...inputs, createNickname: text})}
                           placeholder="Nickname"/>
                <TextInput style={styles.input}
                           value={inputs.createName}
                           onChangeText={(text) => setInputs({...inputs, createName: text})}
                           placeholder="Name {optional}"/>
                <TouchableOpacity style={styles.test} onPress={handleSkip}><Text
                    style={styles.testText}>Skip</Text>
                </TouchableOpacity>
                <Button title="Create Room" onPress={handleRoomCreate}/>
                <Button title="Home" onPress={() => navigation.navigate("Home")}/>
            </View>
        </View>
    )
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        gap: 20,
        alignItems: "center",
        textAlign: "center",
        padding: 20,
        backgroundColor: "rgba(143, 143, 143, 1)",
    },
    subcontainer: {
        width: "90%",
        borderRadius: 20,
        borderStyle: "solid",
        flex: 1,
        justifyContent: "center",
        gap: 20,
        alignItems: "center",
        textAlign: "center",
        padding: 20,
        backgroundColor: "rgba(114, 114, 114, 1)",
    },
    text: {
        fontSize: 22,
        fontWeight: "bold",
    },
    input: {
        width: "90%",
        backgroundColor: "#fff",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 16,
        color: "#333",
        marginVertical: 5,
        textAlign: "center",

        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    test: {
        backgroundColor: "red",
        width: 50,
        height: 50,
    },
    testText: {
        fontSize: 20,
    }
})