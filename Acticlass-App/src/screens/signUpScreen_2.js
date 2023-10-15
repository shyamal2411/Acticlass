import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {colors} from '../common/colors';
import {ScrollView} from 'react-native-gesture-handler';
import RadioButtonRN from 'radio-buttons-react-native';
import validationServices from '../utils/validationServices';

const SignUpScreen_2 = ({navigation}) => {
  const [institute, setInstitute] = useState('');
  const [role, setRole] = useState('');
  const [instituteError, setInstituteError] = useState(false);
  const [roleError, setRoleError] = useState(false);
  const [isChecked, setIsChecked] = useState(true);

  const data = [
    {
      label: 'Student',
    },
    {
      label: 'Teacher',
    },
  ];

  const handleSignUp2 = () => {
    const validateInstituteName =
      validationServices.validateInstituteName(institute);
    const isRoleValid = validationServices.validateRole(role);
    setInstituteError(!validateInstituteName);
    setRoleError(!isRoleValid);

    if (!validateInstituteName || !isRoleValid) {
      // console.log('institute', institute);
      return false;
    } else {
      navigation.navigate('SignUp3');
    }
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
        <View>
          <Text style={styles.title}>Sign Up</Text>
          <View style={{paddingVertical: 16, paddingHorizontal: 40}}>
            <Text style={{fontSize: 16, color: 'black', marginLeft: 10}}>
              Institute Name
            </Text>
            <TextInput
              style={styles.input}
              placeholderTextColor={colors.placeholder}
              placeholder="Enter your institute name"
              onChangeText={setInstitute}
            />
            {instituteError && (
              <Text style={styles.errorText}>
                Please enter valid Institute name
              </Text>
            )}
          </View>
          <View style={{paddingVertical: 16, paddingHorizontal: 40}}>
            <Text style={{fontSize: 16, color: 'black', marginLeft: 10}}>
              Role
            </Text>

            <RadioButtonRN
              data={data}
              selectedBtn={value => setRole(value.label)}
              boxStyle={{borderColor: '#ccc'}}
              textStyle={{color: colors.black}}
              activeColor={colors.primary}
              boxActiveBgColor={colors.white}
            />
            {roleError && (
              <Text style={styles.errorText}>Please select a role</Text>
            )}
          </View>
          <View style={{paddingVertical: 16, paddingHorizontal: 40}}>
            <TouchableOpacity style={styles.button} onPress={handleSignUp2}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              paddingVertical: 16,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{flex: 1, height: 1, backgroundColor: colors.placeholder}}
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
              style={{flex: 1, height: 1, backgroundColor: colors.placeholder}}
            />
          </View>
          <View
            style={{
              alignSelf: 'center',
              flexDirection: 'row',
              paddingVertical: 16,
              paddingHorizontal: 40,
            }}>
            <Text style={{fontSize: 16, color: 'black', marginLeft: 10}}>
              Already have a account?
            </Text>
            <TouchableOpacity
              style={{alignSelf: 'flex'}}
              onPress={moveToSignIn}>
              <Text style={{fontSize: 16, color: colors.primary}}>
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
    textShadowOffset: {width: -10, height: 10},
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
    marginTop: 5,
  },
});

export default SignUpScreen_2;
