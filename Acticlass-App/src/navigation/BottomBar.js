import React from 'react';
import {View, StyleSheet, SafeAreaView} from 'react-native';
import {colors} from '../common/colors';
const BottomBar = ({children}) => {
  return <View style={styles.bottomBar}>{children}</View>;
};

const styles = StyleSheet.create({
  bottomBar: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 18,
    backgroundColor: colors.secondary,
    borderTop: '7px solid black',
  },
});

export default BottomBar;
