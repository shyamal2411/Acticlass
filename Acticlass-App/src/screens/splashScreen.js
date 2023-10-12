import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '../common/colors';

const SplashScreen = ({ navigation }) => {
    // useEffect(() => {
    //     setTimeout(() => {
    //         navigation.replace('AuthStack');
    //     }, 1000);
    // }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.appName}>Acticlass</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
    },
    appName: {
        textShadowColor: 'rgba(0, 0, 0, 0.25))',
        textShadowOffset: { width: -10, height: 10 },
        textShadowRadius: 10,
        fontSize: 72,
        fontWeight: 'bold',
        color: '#CAC1C1',
    },
});

export default SplashScreen;
