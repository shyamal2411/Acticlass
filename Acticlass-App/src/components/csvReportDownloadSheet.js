import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Snackbar from 'react-native-snackbar';
import FeatherIcon from 'react-native-vector-icons/Feather';
import RNFetchBlob from 'rn-fetch-blob';
import {colors} from '../common/colors';
import activityService from '../services/activityService';
import FileViewer from 'react-native-file-viewer';

const CsvReportDownloadSheet = ({groups, cb}) => {
  const groupNames = groups.map(item => item.name);
  const currentDate = moment().toDate();
  const startingDate = moment().startOf('month').toDate();
  const endingDate = moment().toDate();

  const [startDate, setStartDate] = useState(startingDate);
  const [endDate, setEndDate] = useState(endingDate);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(groups[0]);

  const handleDownload = async () => {
    console.log(selectedGroup.id, selectedGroup, startDate, endingDate);
    activityService.getActivitiesForCSV(
      {groupId: selectedGroup.id, startDate, endDate},
      (err, res) => {
        if (err) {
          console.error(err);
          Snackbar.show({
            text: 'Error generating CSV file',
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: colors.danger,
          });
        } else {
          activityService.generateAndDownloadCSV(
            {group: selectedGroup, data: res.data, columns: res.columns},
            (err, path) => {
              if (err) {
                console.error(err);
                Snackbar.show({
                  text: 'Error generating CSV file',
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: colors.danger,
                });
              } else {
                console.log('File downloaded successfully!', path);
                Snackbar.show({
                  text: 'CSV file downloaded successfully!',
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: colors.success,
                  action: {
                    text: 'Open',
                    textColor: 'white',
                    onPress: () => {
                      if (Platform.OS === 'android') {
                        RNFetchBlob.android.actionViewIntent(path, 'text/csv');
                      } else {
                        url = `file://${path}`;
                        FileViewer.open(url)
                          .then(() => {
                            console.log('File opened successfully');
                          })
                          .catch(error => {
                            console.error('Error opening file:', error);
                          });
                      }
                    },
                  },
                });
              }
            },
          );
        }
      },
    );
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
    setSelectedGroup(groups[index]);
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

      <View style={{paddingHorizontal: 40, marginTop: 12}}>
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

      <View style={{paddingHorizontal: 40, marginTop: 10}}>
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

  dateValue: {fontSize: 16, color: 'black', marginTop: 12},
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
