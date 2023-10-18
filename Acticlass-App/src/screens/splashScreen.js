import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '../common/colors';
import { AUTH_TOKEN } from '../common/constants';
import { mmkv } from '../utils/MMKV';

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        //TODO: check if user is logged in
        setTimeout(() => {
            const token = mmkv.getString(AUTH_TOKEN);
            if (token) {
                navigation.replace('AppStack');
            } else {
                navigation.replace('AuthStack');
            }
        }, 1000);
    }, [navigation]);

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
