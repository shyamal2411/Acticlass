import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {colors} from '../common/colors';
import {Formik} from 'formik';
import {signUpValidation3} from '../common/validationSchemas';
import IonIcon from 'react-native-vector-icons/Ionicons';
import authService from '../services/authService';
import Snackbar from 'react-native-snackbar';
import {AUTH_TOKEN, IS_FROM_RESET} from '../common/constants';

const UpdatePasswordaSheet = ({refRBSheet}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState(false);
  const handleUpdate = values => {
    //console.log(values, values.currentPassword, values.confirmPassword);
    authService.changePassword(
      {
        oldPassword: values.currentPassword,
        newPassword: values.confirmPassword,
      },
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
      },
    );
    refRBSheet.current.close();
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Password</Text>

      <Formik
        initialValues={{
          currentPassword: '',
          password: '',
          confirmPassword: '',
        }}
        onSubmit={handleUpdate}
        validationSchema={signUpValidation3}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <View style={{paddingVertical: 8, paddingHorizontal: 40}}>
              <Text style={styles.inputTitle}>Current Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter current password"
                  placeholderTextColor={colors.placeholder}
                  value={values.currentPassword}
                  secureTextEntry={!isCurrentPasswordVisible}
                  onChangeText={handleChange('currentPassword')}
                />
                <IonIcon
                  style={{marginRight: 10}}
                  name={isCurrentPasswordVisible ? 'eye-off' : 'eye'}
                  size={24}
                  color={colors.placeholder}
                  onPress={() =>
                    setIsCurrentPasswordVisible(!isCurrentPasswordVisible)
                  }
                />
              </View>
            </View>
            <View style={{paddingVertical: 8, paddingHorizontal: 40}}>
              <Text style={styles.inputTitle}>New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  value={values.password}
                  secureTextEntry={!isPasswordVisible}
                  placeholderTextColor={colors.placeholder}
                  placeholder="Enter new password"
                  onChangeText={handleChange('password')}
                />
                <IonIcon
                  style={{marginRight: 10}}
                  name={isPasswordVisible ? 'eye-off' : 'eye'}
                  size={24}
                  color={colors.placeholder}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                />
              </View>
              {errors.password ? (
                <Text style={styles.errorText}>{errors.password}</Text>
              ) : null}
            </View>
            <View style={{paddingVertical: 8, paddingHorizontal: 40}}>
              <Text style={styles.inputTitle}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholderTextColor={colors.placeholder}
                  value={values.confirmPassword}
                  secureTextEntry={!isConfirmPasswordVisible}
                  placeholder="Re-enter password"
                  onChangeText={handleChange('confirmPassword')}
                />
                <IonIcon
                  style={{marginRight: 10}}
                  name={isConfirmPasswordVisible ? 'eye-off' : 'eye'}
                  size={24}
                  color={colors.placeholder}
                  onPress={() =>
                    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                  }
                />
              </View>
              {errors.confirmPassword ? (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              ) : null}
            </View>
            <View style={{paddingVertical: 8, paddingHorizontal: 40}}>
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    width: '100%',
    height: 48,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  container: {
    flex: 1,
    alignItems: 'left',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
  },

  button: {
    backgroundColor: colors.primary,
    width: '100%',
    height: 48,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: colors.white,
    fontSize: 16,
    color: colors.black,
    height: 42,
    marginVertical: 4,
    paddingHorizontal: 16,
    width: '90%',
    justifyContent: 'center',
  },
  title: {
    alignSelf: 'center',
    marginVertical: 3,
    color: 'black',
    fontSize: 34,
    fontWeight: '500',
  },
  inputTitle: {
    fontSize: 16,
    color: 'black',
    marginLeft: 15,
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    marginLeft: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});

export default UpdatePasswordaSheet;
