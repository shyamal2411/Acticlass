import {StackActions} from '@react-navigation/routers';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';
import {colors} from '../common/colors';
import Navbar from '../components/navBar';
import {createTwoButtonAlert} from '../components/twoButtonAlert';
import authService from '../services/authService';
import RBSheet from 'react-native-raw-bottom-sheet';
import UpdatePasswordaSheet from '../components/updatePasswordSheet';
const SettingScreen = ({navigation}) => {
  const refRBSheet = React.createRef();

  const handleLogout = () => {
    createTwoButtonAlert({
      title: 'Log Out',
      desc: 'Are you sure you want to log out?',
      positiveText: 'Yes',
      negativeText: 'No',
      onPositive: () => {
        authService.logout(() => {
          navigation.dispatch(StackActions.replace('AuthStack'));
        });
      },
      onNegative: () => {},
    });
  };

  const handleDeleteAcc = () => {
    // handle delete account logic here
    createTwoButtonAlert({
      title: 'Delete Account',
      desc: 'Are you sure you want to delete your account?',
      positiveText: 'Yes',
      negativeText: 'No',
      onPositive: () => {
        authService.deleteAccount((err, res) => {
          if (err) {
            console.error(err);
          } else {
            authService.logout();
            navigation.dispatch(StackActions.replace('AuthStack'));
          }
        });
      },
      onNegative: () => {},
    });
  };

  const handleChangePassword = () => {
    console.log('Change password');
    refRBSheet.current.open();
  };

  return (
    <View style={styles.container}>
      <Navbar title={'Settings'} />
      <TouchableOpacity onPress={handleChangePassword}>
        <Text style={[styles.SettingText, {marginTop: 20}]}>
          Change Password
        </Text>
      </TouchableOpacity>
      <View
        style={{
          height: 1,
          backgroundColor: colors.placeholder,
        }}
      />
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.SettingText}>Log Out</Text>
      </TouchableOpacity>
      <View
        style={{
          height: 1,
          backgroundColor: colors.placeholder,
        }}
      />
      <TouchableOpacity onPress={handleDeleteAcc}>
        <Text style={[styles.SettingText, {color: colors.danger}]}>
          Delete Account
        </Text>
      </TouchableOpacity>

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
        height={Dimensions.get('window').height * 0.55}
        animationType="slide">
        <ScrollView>
          <UpdatePasswordaSheet
            refRBSheet={refRBSheet}
            cb={(err, res) => {
              refRBSheet.current.close();
              if (err) {
                Snackbar.show({
                  text: err.msg,
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: colors.danger,
                });
              } else {
                Snackbar.show({
                  text: res.msg,
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: colors.success,
                });
                //PubSub.publish(PubSubEvents.OnGroupCreated);
              }
            }}
          />
        </ScrollView>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  SettingText: {
    fontSize: 16,
    marginLeft: 32,
    textAlign: 'left',
    color: colors.black,
    marginVertical: 10,
  },
});

export default SettingScreen;
