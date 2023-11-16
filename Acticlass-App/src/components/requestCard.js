import React from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../common/colors';
import { ROLES } from '../common/constants';
import authService from '../services/authService';

const RequestCard = ({ item, group }) => {

  const handleRequest = () => {
    if (authService.getRole() === ROLES.TEACHER) {
      //TODO: handle request      
      console.log('handleRequest', group);
      // socketService.acceptRequest({ groupId: group.id, requestId: item.id, points: 100 }); // just for testing
      // socketService.rejectRequest({ groupId: group.id, requestId: item.id, points: group.penalty }); // just for testing                  
    }
  }

  const getRequestComponent = () => {
    return (<View style={[styles.row, item.isMine ? { flexDirection: 'row-reverse' } : { flexDirection: 'row' }]}>
      <View style={styles.container}>
        <Text style={styles.text}>Raised a Request ✋</Text>
      </View>
    </View>);
  }

  return (
    authService.getRole() === ROLES.TEACHER ?
      <TouchableOpacity onPress={handleRequest}>
        {getRequestComponent()}
      </TouchableOpacity>
      : getRequestComponent()
  );
};

const styles = StyleSheet.create({
  row: {
    marginVertical: 14,
    flexDirection: 'row',
    marginHorizontal: 16,
  },
  container: {
    paddingHorizontal: 8,
    height: 28,
    marginLeft: 16,
    borderRadius: 8,
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  text: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '400',
  },
  text_points: {
    color: colors.placeholder,
    fontSize: 12,
  },
});

export default RequestCard;
