import {stylesMain} from "../../styles/style_main";
import {Alert, Text, TextInput, View, StyleSheet, TouchableOpacity} from "react-native";
import {Button} from "../components/button";
import React, {useContext, useState} from "react";
import {isGameCode} from "../../utils";
import {SocketContext} from "../../contexts/socketContext";

export default function JoinRoomScreen({navigation}) {
    const [screen, setScreen] = useState("menu");
    const socket = useContext(SocketContext);

    const [inputs, setInputs] = useState({
        joinCode: "",
        joinNickname: "",
        joinName: "",
    });

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

    const handleSkip = () => {
        inputs.joinCode = "00000";
        inputs.joinNickname = "B_USER JOIN"
        handleRoomJoin();
    }

    return (
        <View style={styles.container}>
            <View style={styles.subcontainer}>
                <Text style={styles.text}>Join Room</Text>
                <TextInput style={styles.input}
                           value={inputs.joinCode}
                           onChangeText={(text) => setInputs({...inputs, joinCode: text})}
                           placeholder="Room code"/>
                <TextInput style={styles.input}
                           value={inputs.joinNickname}
                           onChangeText={(text) => setInputs({...inputs, joinNickname: text})}
                           placeholder="Nickname"/>
                <TextInput style={styles.input}
                           value={inputs.joinName}
                           onChangeText={(text) => setInputs({...inputs, joinName: text})}
                           placeholder="Name {optional}"/>
                <TouchableOpacity style={styles.test} onPress={handleSkip}><Text
                    style={styles.testText}>Skip</Text>
                </TouchableOpacity>
                <Button title="Join Room" onPress={handleRoomJoin}/>
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
        shadowOffset: {width: 0, height: 2},
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