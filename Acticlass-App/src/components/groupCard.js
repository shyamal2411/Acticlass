import { StackActions } from '@react-navigation/native';
import randomColor from 'randomcolor';
import React from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import RBSheet from 'react-native-raw-bottom-sheet';
import Snackbar from 'react-native-snackbar';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { colors } from '../common/colors';
import { PubSubEvents, ROLES } from '../common/constants';
import { navRef } from '../navigation/navRef';
import authService from '../services/authService';
import groupServices from '../services/groupServices';
<<<<<<< Acticlass-App/src/components/groupCard.js
import EditGroup from './editGroup';
=======
import EditGroup from './EditGroup';
>>>>>>> Acticlass-App/src/components/groupCard.js

const StudentOptions = ['Leader Board', 'Group Info', 'Leave Group'];

const TeacherOptions = [
  'Leader Board',
  'Group Info',
  'Delete Group',
  'Edit group',
];

const groupNameInitials = groupName => {
  groupName = groupName.split(' ');
  if (groupName.length > 1) {
    return groupName[0][0] + groupName[1][0];
  }
  if (groupName.length === 1) {
    if (groupName[0].length > 1) {
      return groupName[0][0] + groupName[0][1];
    }
  }
  return groupName[0][0];
};

const GroupCard = ({ navigation, item }) => {
  const refRBSheet = React.createRef();

  const options =
    authService.getRole() == ROLES.STUDENT ? StudentOptions : TeacherOptions;

  const handleCardPress = () => {
    navRef.current.dispatch(
      StackActions.push('GroupScreen', {
        group: item,
      }))
  }
  const handleOnMore = index => {
    console.log('Selected option: ' + options[index]);

    switch (options[index]) {
      case 'Leader Board':
        navRef.current.dispatch(
          StackActions.push('LeaderBoard', {groupId: item.id}),
        );
        break;
      case 'Group Info':
        // Handle Group Info action
        navRef.current.dispatch(
          StackActions.push('GroupInfo', {
            groupId: item.id,
            groupName: item.name,
            radius: item.radius,
            passingPoints: item.passingPoints,
            attendanceFrequency: item.attendanceFrequency,
            attendanceReward: item.attendanceReward,
            falseRequestPenalty: item.penalty,
          }),
        );
        break;
      case 'Leave Group':
        // Handle Leave Group action
        groupServices.leaveGroup(item.id, (err, res) => {
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
          PubSub.publish(PubSubEvents.OnGroupDeleted);
        });
        break;
      case 'Delete Group':
        // Handle Delete Group action

        Alert.alert(
          'Do you want to delete this group?',
          'This action will delete all the activities associated with this group.',
          [
            {
              text: 'Yes',
              onPress: () => {
                groupServices.deleteGroup({ groupId: item.id }, (err, res) => {
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
                  PubSub.publish(PubSubEvents.OnGroupDeleted);
                });
              },
              style: 'cancel',
            },
            { text: 'Cancel', onPress: () => { } },
          ],
          { cancelable: true },
        );
        break;
      case 'Edit group':
        refRBSheet.current.open();
        // Handle Edit group action
        break;
      default:
        // Handle the default case if needed
        break;
    }
  };

  return (
    <TouchableOpacity onPress={handleCardPress}>
      <View
        style={[
          styles.container,
          {
            shadowColor: colors.placeholder,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.5,
            shadowRadius: 3.84,
            elevation: 5,
            borderRadius: 10,
            marginHorizontal: 30,
            backgroundColor: colors.secondary,
            height: 100,
            marginVertical: 16,
          },
        ]}>
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
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              height: '100%',
            }}>
            <View
              style={{
                width: 60,
                height: 60,
                marginVertical: 20,
                marginLeft: 20,
                backgroundColor: randomColor({
                  luminosity: 'dark',
                  format: 'rgba',
                  alpha: 0.5,
                }),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
              }}>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: '600',
                  color: colors.white,
                }}>
                {groupNameInitials(item.name)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '100%',
                height: '100%',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: colors.black,
                  marginLeft: 16,
                  marginTop: 20,
                }}>
                {item.name}
              </Text>
              <Text style={{ fontSize: 14, color: colors.black, marginLeft: 16 }}>
                Passing Points: {item.passingPoints}
              </Text>
              <Text style={{ fontSize: 14, color: colors.black, marginLeft: 16 }}>
                Radius: {item.radius}
              </Text>
            </View>
            <View
              style={{
                position: 'absolute',
                right: 15,
                top: 15,
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}>
              <Menu>
                <MenuTrigger>
                  <FeatherIcon
                    name="more-horizontal"
                    size={24}
                    color={colors.inactive}
                  />
                </MenuTrigger>
                <MenuOptions>
                  {options.map((option, index) => (
                    <MenuOption
                      key={index}
                      customStyles={{ optionText: styles.menuText }}
                      text={option}
                      onSelect={() => handleOnMore(index)}
                    />
                  ))}
                </MenuOptions>
              </Menu>

              <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                  container: {
                    borderRadius: 10,
                    elevation: 20,
                    backgroundColor: colors.secondary,
                  },
                  wrapper: {
                    backgroundColor: 'rgba(0,0,0,0.2)',
                  },
                  draggableIcon: {
                    backgroundColor: colors.placeholder,
                  },
                }}
                height={Dimensions.get('window').height * 0.85}
                animationType="slide">
                <ScrollView>
                  <EditGroup
                    group={item}
                    cb={(err, res) => {
                      refRBSheet.current.close();
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
                      PubSub.publish(PubSubEvents.OnGroupUpdated);
                    }}
                  />
                </ScrollView>
              </RBSheet>

              {authService.getRole() == ROLES.STUDENT && (
                <View>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.inactive,
                      textAlign: 'right',
                    }}>
                    {item.Points} Points
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
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
});

export default GroupCard;
