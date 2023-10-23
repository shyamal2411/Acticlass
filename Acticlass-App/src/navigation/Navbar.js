import React from 'react';
import {View, Text, Image, StyleSheet, SafeAreaView} from 'react-native';

const Navbar = ({profileImageSource, title}) => {
  return (
    <SafeAreaView style={styles.navbar}>
      <Image source={profileImageSource} style={styles.profileIcon} />
      <Text style={styles.navbarText}>{title}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 10, 167, 1)',
    width: '100%',
    paddingLeft: '25%',
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 15,

    marginVertical: 10,
  },
  navbarText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Navbar;
