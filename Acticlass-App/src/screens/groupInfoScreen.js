import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {colors} from '../common/colors';
import Navbar from '../components/navBar';

const GroupInfoScreen = ({route}) => {
  const {
    groupId,
    radius,
    groupName,
    passingPoints,
    attendanceFrequency,
    attendanceReward,
    falseRequestPenalty,
  } = route.params;

  return (
    <View>
      <Navbar prefixIcon={true} title={groupName}></Navbar>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.image}>
            <QRCode backgroundColor="transparent" value={groupId} size={284} />
          </View>
          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.cellLabel}>Radius </Text>
              <Text style={styles.cellValue}>{radius} m</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.cellLabel}>passing Points </Text>
              <Text style={styles.cellValue}>{passingPoints} points</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.cellLabel}>Attendance Frequency </Text>
              <Text style={styles.cellValue}>{attendanceFrequency} mins</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.cellLabel}>Attendance Reward </Text>
              <Text style={styles.cellValue}>{attendanceReward} points</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.cellLabel}>Default Penalty </Text>
              <Text style={styles.cellValue}>{falseRequestPenalty} points</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    alignSelf: 'center',
    width: 284,
    height: 284,
    backgroundColor: colors.transparent,
    marginTop: 48,
  },
  details: {
    marginTop: 96,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 48,
  },
  cellLabel: {
    paddingVertical: 16,
    fontWeight: 'bold',
    color: colors.black,
    fontSize: 16,
    fontStyle: 'normal',
  },
  cellValue: {
    paddingVertical: 16,
    color: colors.black,
    textAlign: 'right',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
  },
});

export default GroupInfoScreen;
