import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,

  View,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import SelectDropdown from 'react-native-select-dropdown';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../common/colors';
import ActivityScreenMain from '../components/activityBarStats';
import CsvReportDownloadSheet from '../components/csvReportDownloadSheet';
import Navbar from '../components/navBar';
import RewardCard from '../components/rewardCard';
import activitiesData from '../mock/groupActivitiesData';
import groupServices from '../services/groupServices';


const ActivityScreen = () => {
  const refRBSheet = React.createRef();
  const logsForTheDay = activitiesData; // used Mocked data  
  const [selectedGroup, setSelectedGroup] = useState({});
  const [groupNames, setGroupNames] = useState([]);


  const [groups, setGroups] = useState([]);

  useEffect(() => {
    groupServices.getAll((err, res) => {
      if (err) {
        console.error(err);
      } else {
        setGroups(res.groups);
        setSelectedGroup(res.groups[0]);
        setGroupNames(res.groups.map((group) => group.name));
      }
    });
  }, []);

  const handleCsvDownloadClick = () => {
    refRBSheet.current.open();
  };

  const handleSelectGroup = (index, item) => {
    setSelectedGroup(groups[index]);
  };

  const renderLogPortion = () => {
    return (
      <View style={styles.bottomContent}>
        {logsForTheDay.length > 0 ? (
          <FlatList
            style={{ width: '100%' }}
            data={logsForTheDay}
            renderItem={({ item }) => <RewardCard log={item} />}
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

  const renderBarPortion = () => {
    return (
      <View style={styles.topContent}>
        <ActivityScreenMain />
      </View>
    );
  };

  const renderCsvReportDownloadSheet = () => {
    return (
      <View style={{ flex: 1, width: "100%", backgroundColor: colors.secondary }}>
        <View style={{ paddingHorizontal: 16, backgroundColor: colors.secondary }}>
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
            defaultValue={groupNames[0]}
            onSelect={handleSelectGroup}
          />
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    width: '100%',
  },
});

export default ActivityScreen;
