import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {colors} from '../common/colors';
import Navbar from '../components/navBar';

import {FlatList} from 'react-native-gesture-handler';
import Snackbar from 'react-native-snackbar';
import AntDesignIcon from 'react-native-vector-icons/Ionicons';
import {ACTIVITY_TYPES, PubSubEvents, ROLES} from '../common/constants';
import AttendanceRewardCard from '../components/attendanceReward';
import RequestCard from '../components/requestCard';
import RequestApproveCard from '../components/requestapproveCard';
import RequestDeclineCard from '../components/requestdeclineCard';
import ActivityParser from '../services/activityParser';
import authService from '../services/authService';
import locationService from '../services/locationService';
import socketService from '../services/socketService';

const GroupScreen = ({navigation, route}) => {
  const {group} = route.params;
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [sessionBtnText, setSessionBtnText] = useState('Start');
  const [activities, setActivities] = useState([]);

  const groupStatus = cb =>
    socketService.getGroupStatus({groupId: group.id}, cb);

  const getSessionMsg = () => {
    if (isSessionStarted) {
      return 'Session has started.';
    } else {
      return 'Session has not started yet.';
    }
  };

  const getActivities = () => {
    socketService.getGroupStatus({groupId: group.id}, res => {
      setIsSessionStarted(res.isActive);
      setActivities(ActivityParser.parse(res.activities));
    });
  };

  useEffect(() => {
    groupStatus(res => {
      setIsSessionStarted(res.isActive);
      if (authService.getRole() === ROLES.TEACHER) {
        setSessionBtnText(res.isActive ? 'End' : 'Start');
      } else {
        socketService.joinSession({groupId: group.id}, getActivities);
      }
      if (res.activities) {
        setActivities(ActivityParser.parse(res.activities));
      }
    });

    const tokens = [];
    const events = [
      PubSubEvents.OnSessionCreated,
      PubSubEvents.OnSessionJoined,
      PubSubEvents.OnSessionLeft,
      PubSubEvents.OnRequestRaised,
      PubSubEvents.OnRequestAccepted,
      PubSubEvents.OnRequestRejected,
      PubSubEvents.OnPointsUpdated,
    ];

    events.forEach(event => {
      tokens.push(PubSub.subscribe(event, getActivities));
    });

    // leave session when group is deleted
    tokens.push(
      PubSub.subscribe(PubSubEvents.OnSessionDeleted, data => {
        if (authService.getRole() == ROLES.STUDENT) {
          socketService.leaveSession({groupId: group.id});
        } else {
          if (isSessionStarted) socketService.endSession({groupId: group.id});
        }
        navigation.goBack();
      }),
    );

    // leave session when out of range
    tokens.push(
      PubSub.subscribe(PubSubEvents.OnAttendanceRequested, (msg, data) => {
        locationService.getCurrentLocation((err, location) => {
          if (err) return;
          let dist = locationService.distance(location, data.location);
          if (dist > group.radius) {
            Snackbar.show({
              text: 'You are not in the group radius.',
              duration: Snackbar.LENGTH_SHORT,
              backgroundColor: colors.danger,
            });
            socketService.leaveSession({groupId: group.id});
            navigation.goBack();
          } else {
            // mark attendance
            socketService.markAttendance({
              groupId: data.groupId,
              points: group.attendanceReward,
            });
          }
        });
      }),
    );

    return () => {
      tokens.forEach(token => {
        PubSub.unsubscribe(token);
      });
    };
  }, []);

  const handleSession = () => {
    if (isSessionStarted) {
      socketService.endSession({groupId: group.id}, res => {
        setIsSessionStarted(false);
        setSessionBtnText('Start');
      });
    } else {
      locationService.getCurrentLocation((err, location) => {
        if (err) return;
        socketService.startSession({groupId: group.id, location}, res => {
          setIsSessionStarted(true);
          setSessionBtnText('End');
        });
      });
    }
  };

  return (
    <View style={styles.container}>
      <Navbar
        prefixIcon={true}
        title={group.name}
        onBackPress={() => {
          if (authService.getRole() == ROLES.STUDENT) {
            socketService.leaveSession({groupId: group.id});
          } else {
            if (isSessionStarted) socketService.endSession({groupId: group.id});
          }
          navigation.goBack();
          return true;
        }}
      />
      {authService.getRole() == ROLES.TEACHER && (
        <View
          style={{
            alignItems: 'center',
            backgroundColor: colors.inactive,
            width: '100%',
            height: 40,
            flexDirection: 'row',
          }}>
          <Text
            style={{
              flex: 1,
              marginLeft: 34,
              fontSize: 14,
              fontWeight: '400',
              color: colors.white,
            }}>
            {getSessionMsg()}
          </Text>
          <TouchableOpacity style={[styles.button]} onPress={handleSession}>
            <Text style={styles.buttonText}>{sessionBtnText}</Text>
          </TouchableOpacity>
        </View>
      )}
      {isSessionStarted ? (
        <FlatList
          data={activities}
          renderItem={({item}) => {
            if (item.type == ACTIVITY_TYPES.RAISE_REQUEST)
              return <RequestCard item={item} group={group} />;
            if (item.type == ACTIVITY_TYPES.REQUEST_ACCEPTED)
              return <RequestApproveCard item={item} />;
            if (item.type == ACTIVITY_TYPES.REQUEST_REJECTED)
              return <RequestDeclineCard item={item} />;
            if (item.type == ACTIVITY_TYPES.ATTENDANCE)
              return <AttendanceRewardCard item={item} />;
            return <></>;
          }}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '600',
              color: colors.placeholder,
            }}>
            {isSessionStarted ? 'No Conversation.' : 'Session has not started.'}
          </Text>
        </View>
      )}
      {isSessionStarted && authService.getRole() == ROLES.STUDENT && (
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
            onPress={() => {
              socketService.raiseRequest({groupId: group.id}, getActivities);
            }}>
            <AntDesignIcon name="hand-left" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}
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
  fab: {
    position: 'absolute',
    right: 36,
    bottom: 36,
  },
  button: {
    marginRight: 16,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
});

export default GroupScreen;
