import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../common/colors';
import { ROLES } from '../common/constants';
import authService from '../services/authService';

const RewardCard = ({ log }) => {
  const isStudent = authService.getRole() == ROLES.STUDENT;

  const getFormattedTime = () => {
    dateFromTimestamp = new Date(log.timestamp);
    const hours = dateFromTimestamp.getHours();
    const minutes = dateFromTimestamp.getMinutes();
    const amPM = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${amPM}`;
  };

  const getDescriptionForLog = () => {
    return 'You received ' + log.points + ' Points!';
  };

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
          Rewards
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

export default RewardCard;
