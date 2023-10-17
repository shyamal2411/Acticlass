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
import validationServices from '../utils/validationServices';

const SignUpScreen_3 = ({ navigation }) => {
  const [pass, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const handleSignUp3 = () => {
    const isPasswordValid = validationServices.validatePassword(pass.trim());
    const isConfirmPasswordValid = pass === confirmPassword;

    setPasswordError(!isPasswordValid);
    setConfirmPasswordError(!isConfirmPasswordValid);

    if (!isPasswordValid || !isConfirmPasswordValid) {
      return false;
    }
  };

  const moveToSignIn = () => {
    // handle sign up logic here
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
        <View>
          <Text style={styles.title}>Sign Up</Text>
          <View style={{ paddingVertical: 16, paddingHorizontal: 40 }}>
            <Text style={{ fontSize: 16, color: 'black', marginLeft: 10 }}>
              Password
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.password}
                secureTextEntry={!isPasswordVisible}
                placeholderTextColor={colors.placeholder}
                placeholder="Enter your password"
                onChangeText={setPassword}
              />
              <IonIcon
                name={isPasswordVisible ? 'eye-off' : 'eye'}
                size={24}
                color={colors.placeholder}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              />
            </View>
            {passwordError ? (
              <Text style={styles.errorText}>Please set the password</Text>
            ) : null}
          </View>
          <View style={{ paddingVertical: 16, paddingHorizontal: 40 }}>
            <Text style={{ fontSize: 16, color: 'black', marginLeft: 10 }}>
              Confirm Password
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.password}
                secureTextEntry={!isConfirmPasswordVisible}
                placeholderTextColor={colors.placeholder}
                placeholder="Re-enter your password"
                onChangeText={setConfirmPassword}
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
            {confirmPasswordError ? (
              <Text style={styles.errorText}>Passwords doesn't match</Text>
            ) : null}
          </View>
          <View style={{ paddingVertical: 16, paddingHorizontal: 40 }}>
            <TouchableOpacity style={styles.button} onPress={handleSignUp3}>
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
