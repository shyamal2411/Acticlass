import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import signInScreen from '../screens/signInScreen';
import signUpScreen1 from '../screens/signUpScreen_1';
import signUpScreen2 from '../screens/signUpScreen_2';
import signUpScreen3 from '../screens/signUpScreen_3';
import ForgotPasswordScreen from '../screens/forgotPasswordScreen';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="SignIn">
      <Stack.Screen name="SignIn" component={signInScreen} />
      <Stack.Screen name="SignUp1" component={signUpScreen1} />
      <Stack.Screen name="SignUp2" component={signUpScreen2} />
      <Stack.Screen name="SignUp3" component={signUpScreen3} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
