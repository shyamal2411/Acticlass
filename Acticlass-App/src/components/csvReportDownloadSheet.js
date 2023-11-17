import React, {useState} from 'react';
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
  Dimensions,
} from 'react-native';
import {colors} from '../common/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectDropdown from 'react-native-select-dropdown';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {Console} from 'console';
import {forEach, isEmpty} from 'lodash';
import Snackbar from 'react-native-snackbar';

const CsvReportDownloadSheet = ({groups, cb}) => {
  const groupIdNameJson = groups.map(item => {
    return {id: item.id, groupName: item.name};
  });
  const groupIdtoName = {};
  groups.forEach(item => {
    groupIdtoName[item.name] = item.id;
  });
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const startingDate = new Date(currentYear, currentMonth, 1);
  const endingDate = currentDate;

  const [startDate, setStartDate] = useState(startingDate);
  const [endDate, setEndDate] = useState(endingDate);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState({});

  const handleDownload = () => {
    console.log(
      groupIdtoName[selectedGroup],
      selectedGroup,
      startDate,
      endingDate,
    );
    if (isEmpty(selectedGroup)) {
      alert('Please Select Group');
    }
  };

  const handleStartDateChange = (event, selectedDate) => {
    if (event.type == 'set' && selectedDate) {
      setStartDate(selectedDate);
      validateDates(selectedDate, endDate);
    }
    setShowStartPicker(false);
  };

  const handleEndDateChange = (event, selectedDate) => {
    if (event.type == 'set' && selectedDate) {
      setEndDate(selectedDate);
      validateDates(startDate, selectedDate);
    }
    setShowEndPicker(false);
  };

  const showStartDate = () => {
    setShowStartPicker(true);
  };

  const showEndDate = () => {
    setShowEndPicker(true);
  };

  const validateDates = (start, end) => {
    if (start && end && start >= end) {
      Snackbar.show({
        text: 'Start Date must be before End Date',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: colors.danger,
      });
      setStartDate(startingDate);
      setEndDate(endingDate);
    }
  };

  const handleSelectGroup = (selectedItem, index) => {
    setSelectedGroup(selectedItem);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CSV Report</Text>

      <View style={{paddingHorizontal: 40}}>
        <Text style={styles.inputTitle}>Group</Text>
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
            defaultButtonText="Select Group"
            data={groupIdNameJson.map(item => item.groupName)}
            onSelect={handleSelectGroup}
          />
        </View>
      </View>

      <View style={{paddingHorizontal: 40, marginTop: 12}}>
        <Text style={styles.inputTitle}>Start Date</Text>
        <TouchableOpacity style={styles.input} onPress={showStartDate}>
          <Text
            style={
              styles.dateValule
            }>{`${startDate.toLocaleDateString()}`}</Text>
        </TouchableOpacity>
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
          />
        )}
      </View>

      <View style={{paddingHorizontal: 40, marginTop: 10}}>
        <Text style={styles.inputTitle}>End Date</Text>
        <TouchableOpacity style={styles.input} onPress={showEndDate}>
          <Text
            style={styles.dateValule}>{`${endDate.toLocaleDateString()}`}</Text>
        </TouchableOpacity>
        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={handleEndDateChange}
            maximumDate={currentDate}
          />
        )}
      </View>

      <View style={{paddingHorizontal: 40}}>
        <TouchableOpacity style={styles.button} onPress={handleDownload}>
          <Text style={styles.buttonText}>Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'left',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
  },

  title: {
    alignSelf: 'center',
    marginVertical: 3,
    color: colors.black,
    fontSize: 34,
    fontWeight: '600',
  },

  buttonDate: {
    backgroundColor: 'white',
  },

  dateValule: {fontSize: 16, color: 'black', marginTop: 12},
  inputTitle: {
    fontSize: 16,
    color: 'black',
    marginLeft: 4,
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

  button: {
    backgroundColor: colors.primary,
    width: '100%',
    height: 48,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },

  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },

  datePickerStyle: {
    width: 230,
  },
});

export default CsvReportDownloadSheet;
