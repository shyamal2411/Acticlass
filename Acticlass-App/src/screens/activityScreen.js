import React, {useEffect} from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {colors} from '../common/colors';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import authService from '../services/authService';
import FeatherIcon from 'react-native-vector-icons/Feather';
import RBSheet from 'react-native-raw-bottom-sheet';
import CsvReportDownloadSheet from '../components/csvReportDownloadSheet';
import groupServices from '../services/groupServices';
const ActivityScreen = () => {
  const [isEnabled, setIsEnabled] = React.useState(false);
  const refRBSheet = React.createRef();

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

  return (
    <View style={styles.container}>
      <Text style={{color: colors.black}}>Activity Screen</Text>

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
});

export default ActivityScreen;
