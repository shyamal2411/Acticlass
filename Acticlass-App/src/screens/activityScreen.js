import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import SelectDropdown from 'react-native-select-dropdown';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../common/colors';
import { DAYS_OF_WEEK } from '../common/constants';
import ActivityCard from '../components/activityCard';
import CsvReportDownloadSheet from '../components/csvReportDownloadSheet';
import Navbar from '../components/navBar';
import activityService from '../services/activityService';
import groupServices from '../services/groupServices';


const ActivityScreen = ({ navigation }) => {
  const refRBSheet = React.createRef();
  const [selectedGroup, setSelectedGroup] = useState();
  const [groupNames, setGroupNames] = useState([]);
  const [dayLogs, setDayLogs] = useState([]);
  const [selectedBarIndex, setSelectedBarIndex] = useState(new Date().getDay());
  const [weekStartDate, setWeekStartDate] = useState(() => {
    const now = new Date();
    return new Date(now.setDate(now.getDate() - now.getDay()));
  });
  const [weekEndDate, setWeekEndDate] = useState(() => {
    const now = new Date();
    return new Date(now.setDate(now.getDate() - now.getDay() + 6));
  });
  const [weekData, setWeekData] = useState({});

  const getWeek = () => {
    const firstDayOfWeek = new Date(weekStartDate);
    const lastDayOfWeek = new Date(weekEndDate);
    return `${firstDayOfWeek.toLocaleString('default', { month: 'short' })} ${firstDayOfWeek.getDate()} - ${lastDayOfWeek.toLocaleString('default', { month: 'short' })} ${lastDayOfWeek.getDate()}`;
  }

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    groupServices.getAll((err, res) => {
      if (err) {
        console.error(err);
      } else {
        setGroups(res.groups);
        setGroupNames(res.groups.map((group) => group.name));
        setSelectedGroup(res.groups[0]);
      }
    });
  }
    , []);

  useEffect(() => {
    loadWeeklyActivities(weekStartDate, weekEndDate);
  }, [selectedGroup]);

  const handleCsvDownloadClick = () => {
    refRBSheet.current.open();
  };

  const handleSelectGroup = (item, index) => {
    setSelectedGroup(groups[index]);
  };

  const renderLogPortion = () => {
    return (
      <View style={styles.bottomContent}>
        {dayLogs.length > 0 ? (
          <FlatList
            style={{ width: '100%' }}
            data={dayLogs}
            renderItem={({ item }) => <ActivityCard log={item} />}
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '600',
                color: colors.placeholder,
              }}>
              No Activity.
            </Text>
          </View>
        )}
      </View>
    );
  };

  const loadWeeklyActivities = (startDate, endDate) => {
    if (!selectedGroup || !selectedGroup.id) return;
    activityService.getWeeklyActivities({ groupId: selectedGroup.id, startDate, endDate }, (err, res) => {
      if (err) {
        console.error(err);
      } else {
        for (let day of DAYS_OF_WEEK) {
          if (res[day] == null) {
            res[day] = [];
          }
        }
        setWeekData(res);
        if (selectedBarIndex != null) {
          setDayLogs(res[DAYS_OF_WEEK[selectedBarIndex]])
        }
      }
    });
  };

  const moveToPrevWeek = () => {
    const newStartDate = new Date(weekStartDate);
    const newEndDate = new Date(weekEndDate);
    newStartDate.setDate(newStartDate.getDate() - 7);
    newEndDate.setDate(newEndDate.getDate() - 7);
    setWeekStartDate(newStartDate);
    setWeekEndDate(newEndDate);
    loadWeeklyActivities(newStartDate, newEndDate);
  };

  const moveToNextWeek = () => {
    const newStartDate = new Date(weekStartDate);
    const newEndDate = new Date(weekEndDate);
    newStartDate.setDate(newStartDate.getDate() + 7);
    newEndDate.setDate(newEndDate.getDate() + 7);
    setWeekStartDate(newStartDate);
    setWeekEndDate(newEndDate);
    loadWeeklyActivities(newStartDate, newEndDate);
  };

  const onBarSelect = (index) => {
    setSelectedBarIndex(index);
    if (index != null) {
      setDayLogs(weekData[DAYS_OF_WEEK[index]])
    }
  };

  const norm = (value) => {
    let inMin = 0;
    let inMax = 0;
    for (let day of DAYS_OF_WEEK) {
      if (weekData[day] == null) {
        weekData[day] = [];
      }
      inMin = Math.min(inMin, weekData[day].length);
      inMax = Math.max(inMax, weekData[day].length);
    }
    return ((value - inMin)) / (inMax - inMin) || 0;
  };

  const renderBarPortion = () => {
    return (
      <View style={styles.topContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={moveToPrevWeek}>
            <Icon name="arrow-back-ios" style={styles.arrow} size={18} />
          </TouchableOpacity>
          <Text style={styles.headerText}>{getWeek()}</Text>
          <TouchableOpacity onPress={moveToNextWeek} >
            <Icon name="arrow-forward-ios" style={styles.arrow} size={18} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            height: 2,
            backgroundColor: colors.inactive,
          }}
        />
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {Object.keys(weekData).length > 0 && DAYS_OF_WEEK.map((day, index) => {
            let data = weekData[day];
            let barDate = new Date(weekStartDate);
            barDate.setDate(barDate.getDate() + index);
            let nData = norm(data.length);
            return (
              <View key={index} style={{ flex: 1, flexDirection: 'row' }}>
                <TouchableWithoutFeedback
                  style={{ flex: 1 }}
                  onPress={() => onBarSelect(index)}>
                  <View
                    style={[
                      { flex: 1 },
                      selectedBarIndex == index && { backgroundColor: colors.placeholder },
                    ]}>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 16,
                        color: colors.black,
                        marginTop: 12,
                      }}>
                      {day}
                    </Text>
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 16,
                        color: colors.black,
                        marginBottom: 12,
                      }}>
                      {barDate.getDate()}
                    </Text>
                    <View style={{ flex: 1, flexDirection: 'column-reverse' }}>
                      <View
                        style={{
                          backgroundColor: colors.primary,
                          flexGrow: nData,
                        }}
                      />
                      <View
                        style={{
                          backgroundColor: colors.primary,
                          flexShrink:
                            1 - nData,
                        }}
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
                <View style={{ width: 2, backgroundColor: colors.inactive }} />
              </View>
            );
          })}
        </View>
        <View
          style={{
            height: 2,
            backgroundColor: colors.inactive,
          }}
        />
      </View>
    );
  };

  const renderCsvReportDownloadSheet = () => {
    return (
      <View style={{ flex: 1, width: "100%" }}>
        <View style={{ paddingHorizontal: 16, backgroundColor: colors.secondary }}>
          {selectedGroup && <SelectDropdown
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
              marginTop: 8,
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
            defaultValue={selectedGroup.name}
            onSelect={handleSelectGroup}
          />}
        </View>
        {renderBarPortion()}
        {renderLogPortion()}
        <View style={styles.fab}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 52,
              height: 52,
              backgroundColor: colors.primary,
              borderRadius: 50,
            }}
            onPress={handleCsvDownloadClick}>
            <MaterialIcon name="download" size={32} color={colors.white} />
          </TouchableOpacity>
        </View>
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          customStyles={{
            container: {
              borderRadius: 10,
              elevation: 20,
              backgroundColor: colors.secondary,
            },
            wrapper: {
              backgroundColor: 'rgba(0,0,0,0.2)',
            },
            draggableIcon: {
              backgroundColor: colors.placeholder,
            },
          }}
          height={Dimensions.get('window').height * 0.53}
          animationType="slide">
          <View>
            <CsvReportDownloadSheet
              groups={groups}
              cb={(err, res) => {
                refRBSheet.current.close();
                if (err) {
                  Snackbar.show({
                    text: err.msg,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: colors.danger,
                  });
                } else {
                  Snackbar.show({
                    text: res.msg,
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: colors.success,
                  });
                }
              }}
            />
          </View>
        </RBSheet>
      </View>)
  }

  return (
    <View style={styles.container}>
      <Navbar title={'Activities'} />
      {groups.length > 0 ? renderCsvReportDownloadSheet() : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: '600', color: colors.placeholder }}>No Groups.</Text>
      </View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  fab: {
    position: 'absolute',
    right: 44,
    bottom: 8,
  },
  bottomContent: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  topContent: {
    flex: 4,
    backgroundColor: '#e0e0e0',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: colors.secondary,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.black,
  },
  arrow: {
    fontSize: 18,
    color: colors.black,
  },
});

export default ActivityScreen;
