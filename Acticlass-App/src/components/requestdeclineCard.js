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

const requestdeclinecard = () => {
  return (
    <>
      <Text style={styles.container_above}> Sir Name</Text>
      <View style={styles.container}>
        <Text style={styles.text}>Request Declined</Text>
        <Image
          source={require('../Assets/minus-button.png')}
          style={styles.ImageIconStyle}
          resizeMode="contain"
        />
        <Text style={styles.text_points}>-30 points!</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container_above: {
    top: 230,
    left: 23,
  },
  ImageIconStyle: {
    width: 20,
    height: 26,
    marginLeft: 125,
    marginTop: -17,
  },
  container: {
    width: 148,
    height: 44,
    top: 235,
    left: 16,
    borderRadius: 8,
    backgroundColor: '#D9D9D9',
  },
  text: {
    color: '#000000',
    fontFamily: 'Roboto',
    fontSize: 14,
    height: 16,
    width: 120,

    fontWeight: '400',
    lineHeight: 16.41,
  },
  text_points: {
    width: 126,
    height: 16,
    top: 0,
    left: 24,

    fontSize: 12,
    lineHeight: 14.06,
  },
});

export default requestdeclinecard;
