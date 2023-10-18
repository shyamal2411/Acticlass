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
import { forgotPasswordSchema } from '../common/validationSchemas';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, Email] = useState('');

  const handleSendCode = (values) => {
    console.log(values);
    // handle sign in logic here
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
                  placeholder="Email"
                  onChangeText={handleChange('email')}
                />
                {errors.email ? (
                  <Text style={styles.errorText}>
                    {errors.email}
                  </Text>
                ) : null}
              </View>
              <View style={{ paddingVertical: 16, paddingHorizontal: 40 }}>
                <TouchableOpacity style={styles.button} onPress={handleSendCode}>
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

export default ForgotPasswordScreen;
