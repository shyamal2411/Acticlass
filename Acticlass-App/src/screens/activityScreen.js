import React, {useEffect} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../common/colors';
import ActivityScreenMain from '../components/activityBarStats';
import CsvReportDownloadSheet from '../components/csvReportDownloadSheet';
import Navbar from '../components/navBar';
import RewardCard from '../components/rewardCard';
import activitiesData from '../mock/groupActivitiesData';
import groupServices from '../services/groupServices';

const ActivityScreen = () => {
  const [isEnabled, setIsEnabled] = React.useState(false);
  const refRBSheet = React.createRef();
  const logsForTheDay = activitiesData; // used Mocked data
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [groups, setGroups] = React.useState([]);
  useEffect(() => {
    groupServices.getAll((err, res) => {
      if (err) {
        console.error(err);
      } else {
        setGroups(res.groups);
      }
    });
  }, []);

  const handleCsvDownloadClick = () => {
    refRBSheet.current.open();
  };

  const renderLogPortion = () => {
    return (
      <View style={styles.bottomContent}>
        {logsForTheDay.length > 0 ? (
          <FlatList
            style={{width: '100%'}}
            data={logsForTheDay}
            renderItem={({item}) => <RewardCard log={item} />}
          />
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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

  return (
    <View style={styles.container}>
      <Navbar title={'Activities'} />
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
