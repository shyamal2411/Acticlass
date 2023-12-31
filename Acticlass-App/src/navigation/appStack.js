import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import FeatherIcon from 'react-native-vector-icons/Feather';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { colors } from '../common/colors';
import ActivityScreen from '../screens/activityScreen';
import GroupInfoScreen from '../screens/groupInfoScreen';
import GroupScreen from '../screens/groupScreen';
import HomeScreen from '../screens/homeScreen';
import LeaderBoard from '../screens/leaderBoardScreen';
import QrCodeScanScreen from '../screens/qrCodeScanScreen';
import SettingScreen from '../screens/settingScreen';

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
          unmountOnBlur: true,
          tabBarIcon: ({ color }) => (
            <FeatherIcon name="activity" color={color} size={26} />
          ),
        }}
        component={ActivityScreen}
      />
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color }) => (
            <IonIcon name="home" color={color} size={26} />
          ),
        }}
        component={HomeScreen}
      />
      <Tab.Screen
        name="Settings"
        options={{
          tabBarIcon: ({ color }) => (
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
      <Stack.Screen name="GroupInfo" component={GroupInfoScreen} />
      <Stack.Screen name="QRScan" component={QrCodeScanScreen} />
      <Stack.Screen name="LeaderBoard" component={LeaderBoard} />
      <Stack.Screen name="GroupScreen" component={GroupScreen} />
    </Stack.Navigator>
  );
};

export default AppStack;
