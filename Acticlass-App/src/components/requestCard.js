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

const requestcard = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.text}>Raised a Request</Text>
        <Image
          source={require('../Assets/raise-hand.png')}
          style={styles.ImageIconStyle}
          resizeMode="contain"
        />
        {/* <Icon name="hand-raised" size={30} color="black" /> */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  ImageIconStyle: {
    width: 20,
    height: 28,
    marginLeft: -10,
  },
  container: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    backgroundColor: '#F5FCFF',
  },
  button: {
    width: 142,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#D9D9D9',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 184,
    marginLeft: 270,
  },
  text: {
    color: 'black',
    fontFamily: 'Roboto',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 16.41,
    width: 126,
    height: 16,
  },
});

export default requestcard;
