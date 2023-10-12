import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import splashScreen from '../screens/splashScreen';
import authStack from './authStack';

const Stack = createStackNavigator();

export const MainRoute = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName='Splash'
        >
            <Stack.Screen name="Splash" component={splashScreen} />
            <Stack.Screen name="AuthStack" component={authStack} />
        </Stack.Navigator>
    )
}