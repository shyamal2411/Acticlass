import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { colors } from '../common/colors';
// import IonIcon from 'react-native-vector-icons/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';
import { Formik } from 'formik';
import { forgotPasswordSchema, resetCodeSchema, signUpValidation3 } from '../common/validationSchemas';
import authService from '../services/authService';
import Snackbar from 'react-native-snackbar';
import { toInteger } from 'lodash';
import { mmkv } from '../utils/MMKV';
import { AUTH_TOKEN, IS_FROM_RESET } from '../common/constants';
import IonIcon from 'react-native-vector-icons/Ionicons';

const ForgotPasswordScreen = ({ navigation }) => {
  const [isCodeSend, setIsCodeSend] = useState();
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const handleSendCode = (values) => {
    authService.sendResetCode(values.email, (err, res) => {
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
      setIsCodeSend(values.email);
    });
  };

  const handleVerifyCode = (values) => {
    authService.verifyResetCode({ code: toInteger(values.code), email: isCodeSend }, (err, res) => {
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
      mmkv.set(IS_FROM_RESET, true);
      mmkv.set(AUTH_TOKEN, res.token);
      setIsCodeVerified(true);
    });
  };

  const handleResetPassword = (values) => {
    authService.resetPassword({ email: values.email, password: values.password }, (err, res) => {
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
      mmkv.remove(IS_FROM_RESET);
      mmkv.remove(AUTH_TOKEN);
      navigation.navigate('SignIn');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Acticlass</Text>
      <ScrollView
        style={{
          marginTop: 200,
          backgroundColor: colors.secondary,
          width: '100%',
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
        }}>
        {isCodeVerified ? (
          <Formik initialValues={
            {
              password: '',
              confirmPassword: ''
            }
          }
            onSubmit={handleResetPassword}
            validationSchema={signUpValidation3}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <View>
                <Text style={styles.title}>Forgot Password</Text>
                <View style={{ paddingVertical: 16, paddingHorizontal: 40 }}>
                  <Text style={{ fontSize: 16, color: 'black', marginLeft: 10 }}>
                    New Password
                  </Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      value={values.password}
                      style={styles.password}
                      secureTextEntry={!isPasswordVisible}
                      placeholderTextColor={colors.placeholder}
                      placeholder="Enter new password"
                      onChangeText={handleChange('password')}
                    />
                    <IonIcon
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
                <View style={{ paddingVertical: 16, paddingHorizontal: 40 }}>
                  <Text style={{ fontSize: 16, color: 'black', marginLeft: 10 }}>
                    Confirm Password
                  </Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      value={values.confirmPassword}
                      style={styles.password}
                      secureTextEntry={!isConfirmPasswordVisible}
                      placeholderTextColor={colors.placeholder}
                      placeholder="Re-enter password"
                      onChangeText={handleChange('confirmPassword')}
                    />
                    <IonIcon
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
                <View style={{ paddingVertical: 16, paddingHorizontal: 40 }}>
                  <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Reset</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        ) : !isCodeSend ? (
          <Formik initialValues={{ email: '' }} validationSchema={forgotPasswordSchema} onSubmit={handleSendCode}>
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <View>
                <Text style={styles.title}>Forgot Password</Text>
                <View style={{ paddingVertical: 16, paddingHorizontal: 40 }}>
                  <Text style={{ fontSize: 16, color: 'black', marginLeft: 10 }}>
                    Email
                  </Text>
                  <TextInput
                    value={values.email}
                    style={styles.input}
                    placeholderTextColor={colors.placeholder}
                    placeholder="Enter your Email"
                    onChangeText={handleChange('email')}
                  />
                  {errors.email ? (
                    <Text style={styles.errorText}>
                      {errors.email}
                    </Text>
                  ) : null}
                </View>
                <View style={{ paddingVertical: 16, paddingHorizontal: 40 }}>
                  <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Send Code</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    paddingVertical: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}></View>
              </View>
            )}
          </Formik>) : (
          <Formik initialValues={{ code: '' }} validationSchema={resetCodeSchema} onSubmit={handleVerifyCode}>
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <View>
                <Text style={styles.title}>Forgot Password</Text>
                <View style={{ paddingVertical: 16, paddingHorizontal: 40 }}>
                  <Text style={{ fontSize: 16, color: 'black', marginLeft: 10 }}>
                    Code
                  </Text>
                  <TextInput
                    value={values.code}
                    style={styles.input}
                    keyboardType='numeric'
                    placeholderTextColor={colors.placeholder}
                    placeholder="Enter your Code"
                    onChangeText={handleChange('code')}
                  />
                  {errors.code ? (
                    <Text style={styles.errorText}>
                      {errors.code}
                    </Text>
                  ) : null}
                </View>
                <View style={{ paddingVertical: 16, paddingHorizontal: 40 }}>
                  <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Verify</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    paddingVertical: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}></View>
              </View>
            )}
          </Formik>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  appName: {
    marginVertical: 52,
    textShadowColor: 'rgba(0, 0, 0, 0.25))',
    textShadowOffset: { width: -10, height: 10 },
    textShadowRadius: 10,
    fontSize: 72,
    fontWeight: 'bold',
    color: '#CAC1C1',
  },
  title: {
    alignSelf: 'center',
    marginVertical: 24,
    color: 'black',
    fontSize: 34,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'white',
    fontSize: 16,
    color: 'black',
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderRadius: 4,
    marginVertical: 4,
    paddingHorizontal: 10,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  password: {
    width: '90%',
    backgroundColor: 'transparent',
    fontSize: 16,
    color: 'black',
    justifyContent: 'center',
    height: 48,
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
  errorText: {
    color: 'red',
    marginLeft: 5,
  },
});

export default ForgotPasswordScreen;
