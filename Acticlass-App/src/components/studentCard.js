import {StackActions} from '@react-navigation/native';
import randomColor from 'randomcolor';
import React from 'react';
import {createTwoButtonAlert} from './twoButtonAlert';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import {colors} from '../common/colors';
import {PubSubEvents, ROLES} from '../common/constants';
import authService from '../services/authService';

import jsonQuery from 'json-query';

const StudentCard = ({navigation, item}) => {
  // const [members, setMembers] = React.useState([]);
  // const refreshMembers = () => {
  //   groupServices.getMembers(groupId, (err, res) => {
  //     if (err) {
  //       console.error(err);
  //     } else {
  //       // TODO: short members by points
  //       setMembers(res.members);
  //       console.log(res, '  res');
  //       console.log(res.members, '  members');
  //     }
  //   });
  //   setMembers(groupMembersData);
  // };
  // useEffect(() => {
  //   refreshMembers();
  //   const tokens = [];
  //   const events = [
  //     PubSubEvents.ONAppComesToForeground,
  //     PubSubEvents.OnGroupJoined,
  //     PubSubEvents.OnGroupLeft,
  //   ];
  //   events.forEach(event => {
  //     tokens.push(PubSub.subscribe(event, refreshMembers));
  //   });
  //   return () => {
  //     tokens.forEach(token => PubSub.unsubscribe(token));
  //   };
  // }, []);
  return (
    <View
      style={[
        styles.container,
        {
          shadowColor: colors.placeholder,
          shadowOffset: {width: 0, height: 8},
          shadowOpacity: 0.5,
          shadowRadius: 3.84,
          elevation: 5,
          borderRadius: 10,
          marginHorizontal: 30,
          backgroundColor: colors.secondary,
          height: 72,
          marginVertical: 16,
        },
      ]}>
      <View style={styles.rectangle1}>
        <View
          style={{
            width: 50,
            height: 50,
            marginVertical: 11,
            marginLeft: 14,
            flexDirection: 'column',
            backgroundColor: randomColor({
              luminosity: 'dark',
              format: 'rgba',
              alpha: 0.5,
            }),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 25,
          }}>
          <Text style={{fontSize: 16}}>{item.rank}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
          }}>
          <View
            style={{
              marginLeft: 14,
              marginVertical: 16,
              marginRight: 60,
              flexDirection: 'column',
            }}>
            <Text
              style={{fontSize: 14, fontWeight: '400', color: colors.black}}>
              {item.StudentName}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '300',
                marginTop: 12,
                color: colors.black,
              }}>
              {item.EmailId}
            </Text>
          </View>
          <View
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'right',
              flexDirection: 'column',
              paddingTop: 12,
              marginRight: 16,
            }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '400',
                marginLeft: 40,
                marginRight: 60,
                marginBottom: 12,
                color: colors.black,
              }}>
              {item.Points} points
            </Text>
            {authService.getRole() == ROLES.TEACHER && (
              <TouchableOpacity onPress={() => {}}>
                <Text
                  style={{
                    color: colors.danger,
                    //marginRight: 20,
                    marginLeft: 55,
                    marginBottom: 11,
                    fontSize: 14,
                    fontWeight: '400',
                  }}>
                  Remove
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  menuText: {
    color: colors.black,
    fontSize: 16,
    marginVertical: 4,
    marginLeft: 4,
  },
  rectangle1: {
    display: 'flex',
    height: '100%',
    maxHeight: '100%',
    width: '100%',
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: 10,
    //marginVertical: 10,
    maxWidth: '100%',
    shadowColor: colors.placeholder,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default StudentCard;
