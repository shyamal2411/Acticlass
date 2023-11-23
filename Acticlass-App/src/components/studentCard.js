import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Alert} from 'react-native';
import {colors} from '../common/colors';
import {PubSubEvents, ROLES} from '../common/constants';
import authService from '../services/authService';
import groupServices from '../services/groupServices';
import Snackbar from 'react-native-snackbar';

const StudentCard = ({navigation, item, groupId}) => {
  const isStudent = authService.getRole() == ROLES.STUDENT;
  const handleRemove = () => {
    //TODO: remove student from group
    console.log('remove student');
    Alert.alert(
      'Remove Student',
      'Do you want to remove this student from your group?',
      [
        {
          text: 'Yes',
          onPress: () => {
            groupServices.kickUser(
              {userId: item.id, groupId: groupId},
              (err, res) => {
                if (err) {
                  Snackbar.show({
                    text: err.msg,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: colors.danger,
                  });
                  return;
                }
                Snackbar.show({
                  text: res.msg,
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: colors.success,
                });
                PubSub.publish(PubSubEvents.OnGroupMemberKicked);
              },
            );
          },
          style: 'cancel',
        },
        {text: 'Cancel', onPress: () => {}},
      ],
      {cancelable: true},
    );
  };

  return (
    <View style={styles.rectangle}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
        }}>
        <View
          style={{
            width: 50,
            height: 50,
            marginLeft: 14,
            flexDirection: 'column',
            backgroundColor: item.color,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 25,
          }}>
          <Text style={{fontSize: 16}}>{item.index}</Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
        }}>
        <View
          style={{
            marginLeft: 14,
            marginVertical: 16,
            flexDirection: 'column',
          }}>
          <Text style={{fontSize: 14, fontWeight: '400', color: colors.black}}>
            {item.name}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: '300',
              marginTop: 12,
              color: colors.black,
            }}>
            {item.email}
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            flexDirection: 'column',
          }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '400',
              textAlign: 'right',
              marginRight: 16,
              marginBottom: isStudent ? 29 : 13,
              color: colors.black,
            }}>
            {item.points} points
          </Text>
          {authService.getRole() == ROLES.TEACHER && (
            <TouchableOpacity onPress={handleRemove}>
              <Text
                style={{
                  color: colors.danger,
                  textAlign: 'right',
                  marginRight: 16,
                  //marginTop: 4,
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
  rectangle: {
    display: 'flex',
    height: '72',
    maxHeight: '100%',
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: 10,
    marginTop: 16,
    marginHorizontal: 30,
    maxWidth: '100%',
    shadowColor: colors.placeholder,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default StudentCard;
