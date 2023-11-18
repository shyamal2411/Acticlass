import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../common/colors';

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const barHeights = [59, 35, 45, 33, 40, 60, 35];

const ActivityScreenMain = () => {
  const todayIndex = new Date().getDay();
  const [selectedBarIndex, setSelectedBarIndex] = useState(todayIndex);
  const [currentWeek, setCurrentWeek] = useState('');
  const [weekStartDate, setWeekStartDate] = useState(() => {
    const now = new Date();
    return new Date(now.setDate(now.getDate() - now.getDay()));
  });

  useEffect(() => {
    calculateWeekRange(weekStartDate);
  }, [weekStartDate]);

  const calculateWeekRange = startDate => {
    const start = new Date(startDate);
    const offset = start.getDay();
    const firstDayOfWeek = new Date(start.setDate(start.getDate() - offset));
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

    const formatDate = date =>
      `${date.toLocaleString('default', {month: 'short'})} ${date.getDate()}`;
    setCurrentWeek(
      `${formatDate(firstDayOfWeek)} - ${formatDate(lastDayOfWeek)}`,
    );
  };

  const onPreviousWeek = () => {
    const newStartDate = new Date(weekStartDate);
    newStartDate.setDate(newStartDate.getDate() - 7);
    setWeekStartDate(newStartDate);
  };

  const onNextWeek = () => {
    const newStartDate = new Date(weekStartDate);
    newStartDate.setDate(newStartDate.getDate() + 7);
    setWeekStartDate(newStartDate);
  };

  const onSpecificBarPress = index => {
    let barDate = new Date(weekStartDate.getTime());
    barDate.setDate(barDate.getDate() + index);
    //TODO: fetch data for the selected date and show it in the bottom portion
    // console.log('barDate', barDate);
    setSelectedBarIndex(index);
  };

  const minMaxMap = (value, inMin, inMax, outMin, outMax) => {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  };

  const getNormalizedBarHeight = value => {
    return minMaxMap(
      value,
      Math.min.apply(Math, barHeights),
      Math.max.apply(Math, barHeights),
      0,
      1,
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onPreviousWeek}>
          <Icon name="arrow-back-ios" style={styles.arrow} size={18} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{currentWeek}</Text>
        <TouchableOpacity onPress={onNextWeek}>
          <Icon name="arrow-forward-ios" style={styles.arrow} size={18} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: 2,
          backgroundColor: colors.inactive,
        }}
      />
      <View style={{flex: 1, flexDirection: 'row'}}>
        {daysOfWeek.map((day, index) => {
          let barDate = new Date(weekStartDate);
          barDate.setDate(barDate.getDate() + index);
          return (
            <View key={day} style={{flex: 1, flexDirection: 'row'}}>
              <TouchableWithoutFeedback
                style={{flex: 1}}
                onPress={() => onSpecificBarPress(index)}>
                <View
                  style={[
                    {flex: 1},
                    selectedBarIndex == index && {backgroundColor: colors.card},
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
                  <View style={{flex: 1, flexDirection: 'column-reverse'}}>
                    <View
                      style={{
                        backgroundColor: colors.primary,
                        flexGrow: getNormalizedBarHeight(barHeights[index]),
                      }}
                    />
                    <View
                      style={{
                        backgroundColor: colors.primary,
                        flexShrink:
                          1 - getNormalizedBarHeight(barHeights[index]),
                      }}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
              {/* separators */}
              <View style={{width: 2, backgroundColor: colors.inactive}} />
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

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

export default ActivityScreenMain;
