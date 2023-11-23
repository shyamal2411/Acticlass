import { StackActions } from '@react-navigation/routers';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../common/colors';
import Navbar from '../components/navBar';
import { createTwoButtonAlert } from '../components/twoButtonAlert';
import authService from '../services/authService';

const SettingScreen = ({ navigation }) => {

    const handleLogout = () => {
        createTwoButtonAlert({
            title: "Log Out",
            desc: "Are you sure you want to log out?",
            positiveText: "Yes",
            negativeText: "No",
            onPositive: () => {
                authService.logout(() => {
                    navigation.dispatch(StackActions.replace('AuthStack'));
                });
            },
            onNegative: () => { }
        });
    }

    const handleDeleteAcc = () => {
        // handle delete account logic here
        createTwoButtonAlert({
            title: "Delete Account",
            desc: "Are you sure you want to delete your account?",
            positiveText: "Yes",
            negativeText: "No",
            onPositive: () => {
                authService.deleteAccount((err, res) => {
                    if (err) {
                        console.error(err);
                    } else {
                        authService.logout();
                        navigation.dispatch(StackActions.replace('AuthStack'));
                    }
                });
            },
            onNegative: () => { }
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


