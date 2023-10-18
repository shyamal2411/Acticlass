import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors } from '../common/colors';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';

import authService from '../services/authService';
import { Formik } from 'formik';
import { signUpValidation3 } from '../common/validationSchemas';
import Snackbar from 'react-native-snackbar';
import { mmkv } from '../utils/MMKV';
import { AUTH_TOKEN } from '../common/constants';

const SignUpScreen_3 = ({ navigation }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const handleSignUp3 = (values) => {
    authService.updateSignUpData({ password: values.password });
    authService.signUp((err, res) => {
      if (err) {
        Snackbar.show({
          text: err.msg,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: colors.danger,
        });
        return;
      }
      mmkv.set(AUTH_TOKEN, res.token);
      navigation.replace("AppStack");
    });
  };

  const moveToSignIn = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Acticlass</Text>
      <ScrollView
        style={{
          marginTop: 32,
          backgroundColor: colors.secondary,
          width: '100%',
          borderTopLeftRadius: 50,
          borderTopRightRadius: 50,
        }}>
        <Formik initialValues={
          {
            password: '',
            confirmPassword: ''
          }
        }
          onSubmit={handleSignUp3}
          validationSchema={signUpValidation3}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <View>
              <Text style={styles.title}>Sign Up</Text>
              <View style={{ paddingVertical: 16, paddingHorizontal: 40 }}>
                <Text style={{ fontSize: 16, color: 'black', marginLeft: 10 }}>
                  Password
                </Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    value={values.password}
                    style={styles.password}
                    secureTextEntry={!isPasswordVisible}
                    placeholderTextColor={colors.placeholder}
                    placeholder="Enter your password"
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
                    placeholder="Re-enter your password"
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
                  <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  paddingVertical: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{ flex: 1, height: 1, backgroundColor: colors.placeholder }}
                />
                <View>
                  <Text
                    style={{
                      width: 50,
                      textAlign: 'center',
                      color: colors.placeholder,
                    }}>
                    Or
                  </Text>
                </View>
                <View
                  style={{ flex: 1, height: 1, backgroundColor: colors.placeholder }}
                />
              </View>
              <View
                style={{
                  alignSelf: 'center',
                  flexDirection: 'row',
                  paddingVertical: 16,
                  paddingHorizontal: 40,
                }}>
                <Text style={{ fontSize: 16, color: 'black', marginLeft: 10 }}>
                  Already have a account?
                </Text>
                <TouchableOpacity
                  style={{ alignSelf: 'flex' }}
                  onPress={moveToSignIn}>
                  <Text style={{ fontSize: 16, color: colors.primary }}>
                    {' '}
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>

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

export default SignUpScreen_3;
