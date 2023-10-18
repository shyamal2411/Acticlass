import React from 'react';
import { StatusBar, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainRoute } from './src/navigation';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from './src/common/colors';
import { navRef } from './src/navigation/navRef';

export default class App extends React.Component {
  render() {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar
            backgroundColor={colors.primary}
            barStyle="light-content"
          />
          <NavigationContainer ref={navRef}>
            <MainRoute />
          </NavigationContainer>
        </SafeAreaView>
      </GestureHandlerRootView>
    );
  }
}
