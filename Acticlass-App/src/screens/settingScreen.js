import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { colors } from '../common/colors';

const SettingScreen = () => {
    const [isEnabled, setIsEnabled] = React.useState(false);

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
        <View style={styles.container}>
            <Text style={{ color: colors.black }}>Setting Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

});

export default SettingScreen;
