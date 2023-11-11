import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../common/colors';
import { AUTH_TOKEN, IS_FROM_RESET, USER } from '../common/constants';
import authService from '../services/authService';
import { mmkv } from '../utils/MMKV';

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        setTimeout(() => {
            const token = mmkv.getString(AUTH_TOKEN);
            const user = mmkv.getObject(USER);
            const isFromResetPW = mmkv.getBoolean(IS_FROM_RESET) || false;
            if (token && user && !isFromResetPW) {
                authService.setRole(user.role);
                navigation.replace('AppStack');
            } else {
                if (isFromResetPW) {
                    mmkv.remove(IS_FROM_RESET);
                    mmkv.remove(AUTH_TOKEN);
                }
                navigation.replace('AuthStack');
            }
        }, 500);
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
