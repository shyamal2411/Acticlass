import React from 'react';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';

const deviceWidth = Dimensions.get('window').width;

const attedancerewardcard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Attendance Reward</Text>
      <Image
        source={require('../Assets/clock1.png')}
        style={styles.ImageIconStyle}
        resizeMode="contain"
      />
      <Text style={styles.text_points}>+10 points!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  ImageIconStyle: {
    left: 30,
    width: 14,
  },
  container: {
    height: 44,
    left: 16,
    borderRadius: 8,
    backgroundColor: '#D9D9D9',
  },
  text: {
    color: '#000000',
    fontFamily: 'Roboto',
    fontSize: 14,
    height: 16,
    left: 24,
    fontWeight: '400',
  },
  text_points: {
    height: 14,
    left: 24,
    fontSize: 12,
  },
});

export default attedancerewardcard;
