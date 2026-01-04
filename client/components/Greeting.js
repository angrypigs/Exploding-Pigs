import React from 'react';
import { Text, View } from 'react-native';

export default function Greeting({ name }) {
    return (
        <View>
            <Text>Witaj, {name}!</Text>
        </View>
    );
}