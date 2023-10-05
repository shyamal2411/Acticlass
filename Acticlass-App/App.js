import React from "react";
import { StatusBar, View, Text } from 'react-native';


export default class App extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                <Text style={{ fontSize: 20 }}> Welcome to React Native! </Text>
            </View>
        );
    }
}


