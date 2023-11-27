import React from 'react';

import { useEffect } from 'react';
import {
  BackHandler,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../common/colors';
import { navRef } from '../navigation/navRef';

const Navbar = ({
  prefixIcon,
  title,
  onBackPress = () => {
    if (navRef?.current?.canGoBack()) {
      navRef?.current?.goBack();
    } else {
      BackHandler.exitApp();
    }
    return true;
  },
}) => {
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  });

  if (Platform.OS === 'android') {
    return (
      <SafeAreaView style={styles.navbar}>
        <TouchableOpacity
          onPress={onBackPress}
          style={{ width: '28', height: '28' }}>
          {prefixIcon ? (
            <Icon name="arrow-back-ios" style={styles.navIcon} size={28} />
          ) : (
            <View style={{ width: '28', height: '28' }}>
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.navbarText}>{title}</Text>
      </SafeAreaView>
    );
  } else {
    return <View style={{ marginTop: 35 }}></View>;
  }
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingLeft: 8,
    backgroundColor: colors.primary,
    width: '100%',
  },

  navIcon: {
    marginLeft: 20,
    color: 'white',
  },

  navbarText: {
    fontSize: 20,
    marginLeft: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Navbar;
