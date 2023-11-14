import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { colors } from '../common/colors';
import Navbar from '../components/navBar';

import AntDesignIcon from 'react-native-vector-icons/Ionicons';
import { PubSubEvents, ROLES } from '../common/constants';
import authService from '../services/authService';
import socketService from '../services/socketService';

const GroupScreen = ({ navigation, route }) => {
  const { group } = route.params;
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [sessionBtnText, setSessionBtnText] = useState('Start');
  const [activities, setActivities] = useState([]);

  const groupStatus = (cb) => socketService.getGroupStatus({ groupId: group.id }, cb);

  const getSessionMsg = () => {
    if (isSessionStarted) {
      return 'Session has started.';
    } else {
      return 'Session has not started yet.';
    }
  }

  const getActivities = () => {
    socketService.getGroupStatus({ groupId: group.id }, (res) => {
      setIsSessionStarted(res.isActive);
      setActivities(res.activities || []);
    });
  }

  useEffect(() => {
    groupStatus((res) => {
      setIsSessionStarted(res.isActive);
      if (authService.getRole() === ROLES.TEACHER) {
        setSessionBtnText(res.isActive ? 'End' : 'Start');
      } else {
        socketService.joinSession({ groupId: group.id }, getActivities);
      }
      if (res.activities) {
        setActivities(res.activities || []);
      }
    });

    const tokens = [];
    const events = [PubSubEvents.OnSessionCreated, PubSubEvents.OnSessionJoined, PubSubEvents.OnSessionLeft, PubSubEvents.OnRequestRaised, PubSubEvents.OnRequestAccepted, PubSubEvents.OnRequestRejected, PubSubEvents.OnPointsUpdated];

    events.forEach((event) => {
      tokens.push(PubSub.subscribe(event, getActivities));
    });

    tokens.push(PubSub.subscribe(PubSubEvents.OnSessionDeleted, (data) => {
      if (authService.getRole() == ROLES.STUDENT) {
        socketService.leaveSession({ groupId: group.id });
      } else {
        if (isSessionStarted)
          socketService.endSession({ groupId: group.id });
      }
      navigation.goBack();
    }));

    return () => {
      tokens.forEach((token) => {
        PubSub.unsubscribe(token);
      });
    }
  }, []);

  const handleSubmit = () => {
    if (isSessionStarted) {
      socketService.endSession({ groupId: group.id }, (res) => {
        setIsSessionStarted(false);
        setSessionBtnText('Start');
      });
    } else {
      socketService.startSession({ groupId: group.id }, (res) => {
        setIsSessionStarted(true);
        setSessionBtnText('End');
      });
    }
  }


  return (
    <View style={styles.container}>
      <Navbar
        prefixIcon={true}
        title={group.name}
        onBackPress={() => {
          if (authService.getRole() == ROLES.STUDENT) {
            socketService.leaveSession({ groupId: group.id });
          } else {
            if (isSessionStarted)
              socketService.endSession({ groupId: group.id });
          }
          navigation.goBack();
          return true;
        }}
      />
      {authService.getRole() == ROLES.TEACHER && (<View style={{ alignItems: 'center', backgroundColor: colors.inactive, width: '100%', height: 40, flexDirection: 'row' }}>
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
        <TouchableOpacity
          style={[styles.button]}
          onPress={handleSubmit}>
          <Text style={styles.buttonText}>{sessionBtnText}</Text>
        </TouchableOpacity>
      </View>)}
      {/* //TODO: Add group Conversation */}
      {isSessionStarted ? null :
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '600',
              color: colors.placeholder,
            }}>
            {isSessionStarted ? "No Conversation." : "Session has not started."}
          </Text>
        </View>
      }
      {isSessionStarted && authService.getRole() == ROLES.STUDENT && (<View style={styles.fab}>
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
            authService.getRole() == ROLES.STUDENT
              ? refRBSheet.current.open()
              : handleScan();
          }}>
          <AntDesignIcon
            name="hand-left"
            size={24}
            color={colors.white}
          />
        </TouchableOpacity>
      </View>)}
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
    paddingVertical: 4
  },
});

export default GroupScreen;
