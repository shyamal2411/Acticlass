import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { AppState, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MenuProvider } from 'react-native-popup-menu';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from './src/common/colors';
import { PubSubEvents } from './src/common/constants';
import { MainRoute } from './src/navigation';
import { navRef } from './src/navigation/navRef';

export default class App extends React.Component {

  state = {
    appState: AppState.currentState
  }
  token = null;

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      // App comes to foreground
      console.log(["APP State"], 'App comes to foreground');
      this.token = PubSub.publish(PubSubEvents.ONAppComesToForeground);
    } else if (this.state.appState === 'active' && nextAppState.match(/inactive|background/)) {
      // App goes to background
      console.log(["APP State"], 'App goes to the background')
      if (this.token != null) {
        PubSub.unsubscribe(this.token);
      }
    }
    this.setState({ appState: nextAppState });
  }

  componentDidMount() {
    this.stateListener = AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    if (this.stateListener != null)
      this.stateListener.remove();
    if (this.token != null) {
      PubSub.unsubscribe(this.token);
    }
  }

  render() {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <StatusBar
            backgroundColor={colors.primary}
            barStyle="light-content"
          />
          <NavigationContainer ref={navRef}>
            <MenuProvider>
              <MainRoute />
            </MenuProvider>
          </NavigationContainer>
        </SafeAreaView>
      </GestureHandlerRootView>
    );
  }
}
