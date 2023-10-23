import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {colors} from '../common/colors';

const BottomBarItem = ({icon, active, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.bottomBarItem, active && styles.activeItem]}>
        {icon}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bottomBarItem: {
    flex: 0,
    alignItems: 'center',
    color: 'red',
    position: 'fixed',
  },
  activeItem: {
    color: colors.primary,
  },
  activeText: {
    color: colors.primary,
  },
  inactiveText: {
    color: colors.secondary,
  },
});

export default BottomBarItem;
