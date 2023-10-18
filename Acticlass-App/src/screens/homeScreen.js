import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../common/colors';

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={{ color: colors.black }}>Home Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default HomeScreen;
