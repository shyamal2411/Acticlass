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

const requestapprovecard = () => {
  return (
    <>
      <Text style={styles.container_above}> Sir Name</Text>
      <View style={styles.container}>
        <Text style={styles.text}>Request Approved</Text>
        <Image
          source={require('../Assets/check.png')}
          style={styles.ImageIconStyle}
          resizeMode="contain"
        />
        <Text style={styles.text_points}>+100 points!</Text>

        {/* <Icon name="hand-raised" size={30} color="black" /> */}
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
    height: 28,
    marginLeft: 125,
    marginTop: -20,
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
    width: 68,
    height: 14,
    top: 0,
    left: 24,
    fontSize: 12,
    lineHeight: 14.06,
  },
});

export default requestapprovecard;
