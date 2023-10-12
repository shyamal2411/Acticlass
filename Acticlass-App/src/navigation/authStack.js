import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import signInScreen from '../screens/signInScreen';
// import signUpScreen from '../screens/signUpScreen';
// import forgotPasswordScreen from '../screens/forgotPasswordScreen';

const Stack = createStackNavigator();

const AuthStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName='SignIn'
        >
            <Stack.Screen name="SignIn" component={signInScreen} />
            {/* <Stack.Screen name="SignUp" component={signUpScreen} />
            <Stack.Screen name="ForgotPassword" component={forgotPasswordScreen} /> */}
        </Stack.Navigator>
    )
}

export default AuthStack;