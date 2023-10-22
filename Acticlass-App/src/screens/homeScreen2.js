import React from 'react';
import {View, Text, Image, Button} from 'react-native';
import {color} from '../common/colors';
import IconImage from '../Assets/RectangleImage.png';

const HomeScreen2 = () => {
  return (
    <View>
      <View
        style={{
          flexDirection: 'column',
          marginVertical: '3%',
          shadowColor: 'yellow',
          shadowOffset: {width: 0, height: 8},
          shadowOpacity: 0.25,
          shadowRadius: 10,
          shadowColor: 'black',
          borderRadius: 10,
          shadowOffset: {width: 0, height: 8},
          shadowOpacity: 0.25,
          shadowRadius: 10,
        }}>
        <View
          style={{
            height: 110,
            backgroundColor: 'rgba(230, 230, 230, 1)',
            flexDirection: 'row',
            top: 10,
            width: '95%',
            alignSelf: 'center',
            borderRadius: 10,
            shadowColor: 'black',
            shadowOffset: {width: 0, height: 8},
            shadowOpacity: 0.25,
            shadowRadius: 10,
          }}>
          <View
            style={{
              height: '100%',
              backgroundColor: 'rgba(230, 230, 230, 1)',
              width: '30%',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
            }}>
            <Image
              source={IconImage}
              style={{
                height: '75%',
                width: '75%',
                alignSelf: 'center',
                borderRadius: 10,
              }}
            />
          </View>
          <View
            style={{
              height: '100%',
              backgroundColor: 'rgba(230, 230, 230, 1)',
              width: '45%',
              justifyContent: 'center',
              alignItems: 'left',
              // marginLeft: '5%',
            }}>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 8}}>
              Group Name
            </Text>
            <Text>Status - On going</Text>
            <Text>Radius - 50 m</Text>
            <Text>Passing points - 500</Text>
          </View>
          <View
            style={{
              height: '100%',
              backgroundColor: 'rgba(230, 230, 230, 1)',
              width: '20%',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
            }}>
            <Button
              //   onPress={onPressLearnMore}
              title="..."
              style={{width: '10%'}}
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            />
            <Text>257 Points</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen2;
