import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { colors } from '../common/colors';

const ActivityScreen = () => {
    const [isEnabled, setIsEnabled] = React.useState(false);

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
        <View style={styles.container}>
            <Text style={{ color: colors.black }}>Activity Screen</Text>
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

export default ActivityScreen;
