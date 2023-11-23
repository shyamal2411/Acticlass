import moment from 'moment';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../common/colors';
import { ACTIVITY_TYPES, ROLES } from '../common/constants';
import authService from '../services/authService';

const ActivityCard = ({ log }) => {
  const isStudent = authService.getRole() == ROLES.STUDENT;

  const getFormattedTime = () => {
    return moment(log.timestamp).format('hh:mm A');
  };

  const getDescriptionForLog = () => {
    if (isStudent) {
      if (log.type == ACTIVITY_TYPES.REQUEST_ACCEPTED || log.type == ACTIVITY_TYPES.ATTENDANCE) {
        return 'You received ' + log.points + ' points!';
      } else if (log.type == ACTIVITY_TYPES.REQUEST_REJECTED) {
        return 'You lost ' + log.points + ' points!';
      }
    } else {
      if (log.type == ACTIVITY_TYPES.REQUEST_ACCEPTED) {
        return 'You rewarded ' + log.points + ' points to ' + log.triggerFor.triggerBy.name + '!';
      } else if (log.type == ACTIVITY_TYPES.REQUEST_REJECTED) {
        return 'You penalized ' + log.points + ' points to ' + log.triggerFor.triggerBy.name + '!';
      } else if (log.type == ACTIVITY_TYPES.ATTENDANCE) {
        return log.triggerBy.name + ' received ' + log.points + ' points!';
      }
    }
    return log.points + ' points';
  };

  const getTitle = () => {
    if (log.type == ACTIVITY_TYPES.REQUEST_ACCEPTED) {
      return "Reward";
    } else if (log.type == ACTIVITY_TYPES.REQUEST_REJECTED) {
      return "Penalty";
    }
    return "Attendance";
  }

  return (
    <View style={styles.rectangle}>
      <View
        style={{
          flexDirection: 'column',
          marginTop: 10,
          marginLeft: 16,
          height: '100%',
        }}>
        <Text style={{ color: colors.black, fontSize: 14, fontWeight: 600 }}>
          {getTitle()}
        </Text>
        <View
          style={{
            marginTop: 6,
            height: '100%',
          }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: 400,
              color: colors.black,
            }}>
            {getDescriptionForLog()}
          </Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          alignContent: 'flex-end',
          height: '100%',
          display: 'flex',
          marginTop: 12,
          marginRight: 10,
        }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: 400,
            textAlign: 'right',
            color: colors.black,
          }}>
          {getFormattedTime()}
        </Text>
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
    height: 56,
    maxHeight: '100%',
    flexDirection: 'row',
    backgroundColor: colors.secondary,
    borderRadius: 10,
    marginTop: 24,
    marginHorizontal: 8,
    maxWidth: '100%',
    shadowColor: colors.placeholder,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ActivityCard;
