import React from 'react';

import {
  BackHandler,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../common/colors';
import { navRef } from '../navigation/navRef';

const Navbar = ({
  prefixIcon,
  title,
  onPress = () => {
    if (navRef?.current?.canGoBack()) {
      navRef?.current?.goBack();
    } else {
      BackHandler.exitApp();
    }
    return true;
  },
}) => {
  return (
    <SafeAreaView style={styles.navbar}>
      <TouchableOpacity onPress={onPress} style={{ width: '28', height: '28' }}>
        {prefixIcon ? (
          <Icon name="arrow-back-ios" style={styles.navIcon} size={28} />
        ) : (
          <View style={{ width: '28', height: '28' }}>
            {/* //TODO: add initials of the user */}
          </View>
        )}
      </TouchableOpacity>
      <Text style={styles.navbarText}>{title}</Text>
    </SafeAreaView>
  );
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
