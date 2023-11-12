import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import {colors} from '../common/colors';
import Navbar from '../components/navBar';

import FeatherIcon from 'react-native-vector-icons/Feather';
import authService from '../services/authService';
import {PubSubEvents, ROLES} from '../common/constants';
import AntDesignIcon from 'react-native-vector-icons/Ionicons';
import {NavigationContainer} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const handleSubmit = values => {};

const groupScreen = ({route}) => {
  //const {groupName} = route.params;

  return (
    <View>
      <Navbar
        prefixIcon={true}
        title="Group Name"
        suffix={
          <TouchableOpacity style={{margin: 10}}>
            <Icon name="ellipsis-v" size={50} color={colors.white} />
          </TouchableOpacity>
        }
      />
      <View style={{backgroundColor: 'grey', width: '100%', height: 30}}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '400',
            color: colors.white,
          }}>
          Session has started.
        </Text>

        <TouchableOpacity
          style={[styles.button, {alignSelf: 'flex-end'}]}
          onPress={handleSubmit}>
          <Text style={styles.buttonText}>Join</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.container}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '600',
                color: colors.placeholder,
              }}>
              No Conversation
            </Text>
          </View>
        </View>
      </ScrollView>
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
          {authService.getRole() == ROLES.STUDENT ? (
            <FeatherIcon name="plus" size={45} color={colors.white} />
          ) : (
            <AntDesignIcon
              name="hand-left-outline"
              size={35}
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
    position: 'relative',
    right: -320,
    bottom: -670,
  },
  button: {
    backgroundColor: colors.primary,
    width: '20%',
    height: 20,
    marginTop: '-5%',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default groupScreen;
