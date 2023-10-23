import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/homeScreen';
import ActivityScreen from '../screens/activityScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SettingScreen from '../screens/settingScreen';
import {colors} from '../common/colors';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTabStack = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: {
          backgroundColor: colors.secondary,
          borderTopWidth: 0,
          elevation: 4,
          height: 56,
          paddingBottom: 4,
        },
      }}
      initialRouteName="Home">
      <Tab.Screen
        name="Activity"
        options={{
          tabBarIcon: ({color}) => (
            <FeatherIcon name="activity" color={color} size={26} />
          ),
        }}
        component={ActivityScreen}
      />
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({color}) => (
            <IonIcon name="home" color={color} size={26} />
          ),
        }}
        component={HomeScreen}
      />
      <Tab.Screen
        name="Settings"
        options={{
          tabBarIcon: ({color}) => (
            <IonIcon name="settings" color={color} size={26} />
          ),
        }}
        component={SettingScreen}
      />
    </Tab.Navigator>
  );
};

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="HomeTabs">
      <Stack.Screen name="HomeTabs" component={HomeTabStack} />
    </Stack.Navigator>
  );
};

export default AppStack;
