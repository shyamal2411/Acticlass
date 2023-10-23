import React, { useState } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Button,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import { colors } from '../common/colors';
import { Formik } from 'formik';
import { useHeaderHeight } from '@react-navigation/elements';
import SelectDropdown from 'react-native-select-dropdown';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { ATTENDANCE_FREQUENCY } from '../common/constants';
import { groupCreation } from '../common/validationSchemas';
import groupServices from '../services/groupServices';

const CreateNewGroup = ({ cb }) => {
  handleClickOnCreate = values => {
    console.log('Group Creation', values);
    //TODO: handle validation and group creation API call
    if (cb) {
      cb(true);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.wrapper}
      keyboardVerticalOffset={
        Platform.OS === 'ios' ? useHeaderHeight() + 56 : 56
      }>
      <View style={styles.container}>
        <SafeAreaView
          style={{
            backgroundColor: colors.secondary,
            width: '100%',
          }}>
          <Text style={styles.title}>Create Group</Text>
          <Formik
            initialValues={{
              name: '',
              radius: '',
              passingPoints: '',
              attendanceFrequency: '',
              attendanceReward: '',
              falseRequestPenalty: '',
            }}
            onSubmit={handleClickOnCreate}
            validationSchema={groupCreation}
          // TODO: define validationSchema for group form fields
          // Syntax : validationSchema={function}, formic documentation for more.
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View>
                <View style={{ paddingVertical: 8, paddingHorizontal: 40 }}>
                  <Text style={styles.inputTitle}>Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter group name"
                    placeholderTextColor="#9e9292"
                    value={values.name}
                    onChangeText={handleChange('name')}
                  />
                  {errors.name ? (
                    <Text style={styles.errorText}>{errors.name}</Text>
                  ) : null}
                </View>
                <View style={{ paddingVertical: 8, paddingHorizontal: 40 }}>
                  <Text style={styles.inputTitle}>{`Radius `}</Text>
                  <TextInput
                    style={styles.input}
                    inputMode='numeric'
                    placeholder="Enter radius in meters"
                    placeholderTextColor="#9e9292"
                    value={values.radius}
                    onChangeText={handleChange('radius')}
                  />
                  {errors.radius ? (
                    <Text style={styles.errorText}>{errors.radius}</Text>
                  ) : null}
                </View>
                <View style={{ paddingVertical: 8, paddingHorizontal: 40 }}>
                  <Text style={styles.inputTitle}>Passing Points</Text>
                  <TextInput
                    style={styles.input}
                    inputMode='numeric'
                    placeholder="Enter passing points"
                    placeholderTextColor="#9e9292"
                    value={values.passingPoints}
                    onChangeText={handleChange('passingPoints')}
                  />
                  {errors.passingPoints ? (
                    <Text style={styles.errorText}>{errors.passingPoints}</Text>
                  ) : null}
                </View>
                <View style={{ paddingVertical: 8, paddingHorizontal: 40 }}>
                  <Text style={styles.inputTitle}>Attendance Frequency (in minutes)</Text>
                  <View>
                    <SelectDropdown
                      renderDropdownIcon={() => {
                        return (
                          <FeatherIcon
                            name="chevron-down"
                            size={24}
                            color={colors.placeholder}
                          />
                        );
                      }}
                      dropdownIconPosition="right"
                      buttonStyle={{
                        backgroundColor: 'white',
                        width: '100%',
                        fontSize: 16,
                        borderColor: '#ccc',
                        borderWidth: 1,
                        borderRadius: 4,
                        marginTop: 4,
                        height: 48,
                      }}
                      buttonTextStyle={{
                        textAlign: 'left',
                        color: 'black',
                        fontSize: 16,
                      }}
                      dropdownStyle={{
                        borderColor: '#ccc',
                        borderWidth: 1,
                        borderRadius: 4,
                      }}
                      rowTextStyle={{
                        textAlign: 'left',
                        color: 'black',
                        fontSize: 16,
                      }}
                      defaultButtonText="Select frequency"
                      data={ATTENDANCE_FREQUENCY}
                      onSelect={(selectedItem, index) => {
                        handleChange('attendanceFrequency')(selectedItem);
                      }}
                    />
                    {errors.attendanceFrequency ? (
                      <Text style={styles.errorText}>
                        {errors.attendanceFrequency}
                      </Text>
                    ) : null}
                  </View>
                </View>
                <View style={{ paddingVertical: 8, paddingHorizontal: 40 }}>
                  <Text style={styles.inputTitle}>Attendance Reward</Text>
                  <TextInput
                    style={styles.input}
                    inputMode='numeric'
                    placeholder="Enter Attendance Reward points"
                    placeholderTextColor="#9e9292"
                    value={values.attendanceReward}
                    onChangeText={handleChange('attendanceReward')}
                  />
                  {errors.attendanceReward ? (
                    <Text style={styles.errorText}>
                      {errors.attendanceReward}
                    </Text>
                  ) : null}
                </View>
                <View style={{ paddingVertical: 8, paddingHorizontal: 40 }}>
                  <Text style={styles.inputTitle}>False Request Penalty</Text>
                  <TextInput
                    style={styles.input}
                    inputMode='numeric'
                    placeholder="Enter penalty points"
                    placeholderTextColor="#9e9292"
                    value={values.falseRequestPenalty}
                    onChangeText={handleChange('falseRequestPenalty')}
                  />
                  {errors.falseRequestPenalty ? (
                    <Text style={styles.errorText}>
                      {errors.falseRequestPenalty}
                    </Text>
                  ) : null}
                </View>
                <View style={{ paddingVertical: 8, paddingHorizontal: 40 }}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Create</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
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
    marginLeft: 10,
  },
  errorText: {
    color: 'red',
    marginLeft: 5,
  },
});

export default CreateNewGroup;
