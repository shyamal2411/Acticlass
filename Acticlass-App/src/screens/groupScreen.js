import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { colors } from '../common/colors';
import Navbar from '../components/navBar';

import AntDesignIcon from 'react-native-vector-icons/Ionicons';
import { ROLES } from '../common/constants';
import authService from '../services/authService';

const GroupScreen = ({ route }) => {
  //const {groupName} = route.params;
  const [isSessionStarted, setIsSessionStarted] = useState(false);

  const handleSubmit = () => {

  }

  return (
    <View style={styles.container}>
      <Navbar
        prefixIcon={true}
        title="Group Name"
      />
      <View style={{ alignItems: 'center', backgroundColor: colors.inactive, width: '100%', height: 40, flexDirection: 'row' }}>
        <Text
          style={{
            flex: 1,
            marginLeft: 34,
            fontSize: 14,
            fontWeight: '400',
            color: colors.white,
          }}>
          Session has started.
        </Text>
        <TouchableOpacity
          style={[styles.button]}
          onPress={handleSubmit}>
          <Text style={styles.buttonText}>Join</Text>
        </TouchableOpacity>
      </View>
      {/* //TODO: Add group Conversation */}
      {isSessionStarted ? null :
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '600',
              color: colors.placeholder,
            }}>
            No Conversation.
          </Text>
        </View>
      }
      <View style={styles.fab}>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 52,
            height: 52,
            backgroundColor: colors.primary,
            borderRadius: 50,
          }}
          onPress={() => {
            authService.getRole() == ROLES.STUDENT
              ? refRBSheet.current.open()
              : handleScan();
          }}>
          {authService.getRole() == ROLES.STUDENT && (
            <AntDesignIcon
              name="hand-left"
              size={24}
              color={colors.white}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    alignSelf: 'center',
    width: 284,
    height: 284,
    backgroundColor: colors.transparent,
    marginTop: 48,
  },
  details: {
    marginTop: 96,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 48,
  },
  cellLabel: {
    paddingVertical: 16,
    fontWeight: 'bold',
    color: colors.black,
    fontSize: 16,
    fontStyle: 'normal',
  },
  cellValue: {
    paddingVertical: 16,
    color: colors.black,
    textAlign: 'right',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
  },
  fab: {
    position: 'absolute',
    right: 36,
    bottom: 36,
  },
  button: {
    marginRight: 16,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingVertical: 4
  },
});

export default GroupScreen;
