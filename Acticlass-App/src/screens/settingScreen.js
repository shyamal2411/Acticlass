import React from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../common/colors';
import Navbar from '../components/navBar';
import { mmkv } from '../utils/MMKV';
import { AUTH_TOKEN } from '../common/constants';
import { StackActions } from '@react-navigation/routers';
import authService from '../services/authService';

const SettingScreen = ({ navigation }) => {

    const handleLogout = () => {
        mmkv.remove(AUTH_TOKEN);
        navigation.dispatch(StackActions.replace('AuthStack'));
    }

    const handleDeleteAcc = () => {
        // handle delete account logic here
        authService.deleteAccount((err, res) => {
            if (err) {
                console.error(err);
            } else {
                mmkv.remove(AUTH_TOKEN);
                navigation.dispatch(StackActions.replace('AuthStack'));
            }
        });
    }

    return (
        <View style={styles.container}>
            <Navbar title={"Settings"} />
            <TouchableOpacity onPress={handleLogout}>
                <Text style={[styles.SettingText, { marginTop: 20 }]}>Log Out</Text>
            </TouchableOpacity>
            <View
                style={{
                    height: 1,
                    backgroundColor: colors.placeholder,
                }}
            />
            <TouchableOpacity onPress={handleDeleteAcc}>
                <Text style={[styles.SettingText, { color: colors.danger }]}>Delete Account</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    SettingText: {
        fontSize: 16,
        marginLeft: 32,
        textAlign: 'left',
        color: colors.black,
        marginVertical: 10,
    },
});

export default SettingScreen;


