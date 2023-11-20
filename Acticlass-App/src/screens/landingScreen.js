import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { colors } from '../common/colors';
import { AUTH_TOKEN, IS_FROM_RESET, IntroSliderCarousel, USER } from '../common/constants';
import authService from '../services/authService';
import { mmkv } from '../utils/MMKV';

const LandingScreen = ({ navigation }) => {
  _renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.container}>
          <Text style={styles.title}>{item.title}</Text>
          <Image source={item.image()} style={styles.image} />
          <Text style={styles.text}>{item.text}</Text>
        </View>
      </View>
    );
  };

  _onDone = () => {
    const token = mmkv.getString(AUTH_TOKEN);
    const user = mmkv.getObject(USER);
    const isFromResetPW = mmkv.getBoolean(IS_FROM_RESET) || false;
    if (token && user && !isFromResetPW) {
      authService.setRole(user.role);
      navigation.replace('AppStack');
    } else {
      if (isFromResetPW) {
        mmkv.remove(IS_FROM_RESET);
        mmkv.remove(AUTH_TOKEN);
      }
      navigation.replace('AuthStack');
    }
  };

  return (
    <AppIntroSlider
      data={IntroSliderCarousel}
      renderItem={this._renderItem}
      renderDoneButton={this._renderDoneButton}
      onDone={this._onDone}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginHorizontal: 14,
    color: colors.light,
  },
  image: {
    width: 280,
    height: 320,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.light,
    marginHorizontal: 14,
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: colors.placeholder,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LandingScreen;
