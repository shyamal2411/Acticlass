import React from 'react';

import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../common/colors';

const RequestDeclineCard = ({item}) => {
  return (
    <View
      style={[
        styles.row,
        item.isMine ? {flexDirection: 'row-reverse'} : {flexDirection: 'row'},
      ]}>
      <View style={styles.container}>
        <Text style={styles.text}>Request Declined ⛔</Text>
        <Text style={styles.text_points}>-{item.points} points!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    marginVertical: 14,
    flexDirection: 'row',
    marginHorizontal: 16,
  },
  container: {
    paddingHorizontal: 8,
    height: 44,
    marginLeft: 16,
    borderRadius: 8,
    backgroundColor: colors.card,
  },
  text: {
    color: colors.black,
    fontSize: 14,
    marginTop: 6,
    fontWeight: '400',
  },
  text_points: {
    color: colors.placeholder,
    fontSize: 12,
  },
});

export default RequestDeclineCard;
