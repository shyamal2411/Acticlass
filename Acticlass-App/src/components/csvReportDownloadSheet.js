import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Snackbar from 'react-native-snackbar';
import FeatherIcon from 'react-native-vector-icons/Feather';
import RNFetchBlob from 'rn-fetch-blob';
import { colors } from '../common/colors';

const CsvReportDownloadSheet = ({ groups, cb }) => {
  const groupNames = groups.map(item => item.name);
  const groupIdToName = {};
  groups.forEach(item => {
    groupIdToName[item.name] = item.id;
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
  const [selectedGroup, setSelectedGroup] = useState(groupNames[0]);

  const convertToCSV = (data) => {
    // Implement logic to convert data to CSV format
    // Example:
    const csvRows = data.map((row) => row.join(',')); // Assuming 'data' is a 2D array representing rows and columns
    return csvRows.join('\n');
  };
  const dataToGenerate = [
    ['Name', 'Age', 'Email'],
    ['John Doe', '30', 'john@example.com'],
    ['Jane Smith', '25', 'jane@example.com'],
  ];

  const handleDownload = async () => {
    console.log(
      groupIdToName[selectedGroup],
      selectedGroup,
      startDate,
      endingDate,
    );
    const csvData = convertToCSV(dataToGenerate);
    const pathToWrite = `${RNFetchBlob.fs.dirs.DownloadDir}/data.csv`;
    try {
      // Download the temporary file to the Downloads directory
      RNFetchBlob.fs.writeFile(pathToWrite, csvData, 'utf8').then(async () => {
        console.log('File downloaded successfully!');
        if (Platform.OS === 'android') {
          await RNFetchBlob.android.actionViewIntent(pathToWrite, 'text/csv');
        } else {
          await RNFetchBlob.ios.openDocument(pathToWrite);
        }
      })
        .catch((error) => {
          console.log('Error downloading file:', error);
        });

      console.log('CSV file downloaded successfully!');
    } catch (error) {
      console.error('Error generating or downloading CSV file:', error);
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

      <View style={{ paddingHorizontal: 40 }}>
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
            defaultValueByIndex={0}
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
            data={groupNames}
            onSelect={handleSelectGroup}
          />
        </View>
      </View>

      <View style={{ paddingHorizontal: 40, marginTop: 12 }}>
        <Text style={styles.inputTitle}>Start Date</Text>
        <TouchableOpacity style={styles.input} onPress={showStartDate}>
          <Text
            style={
              styles.dateValue
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

      <View style={{ paddingHorizontal: 40, marginTop: 10 }}>
        <Text style={styles.inputTitle}>End Date</Text>
        <TouchableOpacity style={styles.input} onPress={showEndDate}>
          <Text
            style={styles.dateValue}>{`${endDate.toLocaleDateString()}`}</Text>
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

      <View style={{ paddingHorizontal: 40 }}>
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

  dateValue: { fontSize: 16, color: 'black', marginTop: 12 },
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
