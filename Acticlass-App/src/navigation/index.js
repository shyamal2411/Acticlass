import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import splashScreen from '../screens/splashScreen';
import appStack from './appStack';
import authStack from './authStack';
import IntroSliderScreen from '../screens/IntroSliderScreen';

const Stack = createStackNavigator();

export const MainRoute = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Splash">
      <Stack.Screen name="Intro" component={IntroSliderScreen} />
      <Stack.Screen name="Splash" component={splashScreen} />
      <Stack.Screen name="AuthStack" component={authStack} />
      <Stack.Screen name="AppStack" component={appStack} />
    </Stack.Navigator>
  );
};
