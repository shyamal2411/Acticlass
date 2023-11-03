import PubSub from 'pubsub-js';
import React, { useEffect } from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Snackbar from 'react-native-snackbar';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { colors } from '../common/colors';
import { PubSubEvents } from '../common/constants';
import CreateNewGroup from '../components/createNewGroupSheet';
import GroupCard from '../components/groupCard';
import Navbar from '../components/navBar';
import groupServices from '../services/groupServices';

const HomeScreen = ({ navigation }) => {
  const refRBSheet = React.createRef();
  const [groups, setGroups] = React.useState([]);

  const refreshGroups = () => {
    groupServices.getAll((err, res) => {
      if (err) {
        console.error(err);
      } else {
        setGroups(res.groups);
      }
    });
  };

  useEffect(() => {
    refreshGroups();
    const t1 = PubSub.subscribe(PubSubEvents.OnGroupCreated, refreshGroups);
    const t2 = PubSub.subscribe(PubSubEvents.OnGroupUpdated, refreshGroups);
    const t3 = PubSub.subscribe(PubSubEvents.OnGroupDeleted, refreshGroups);
    return () => {
      PubSub.unsubscribe(t1);
      PubSub.unsubscribe(t2);
      PubSub.unsubscribe(t3);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Navbar title={'Home'}></Navbar>
      {groups.length > 0 ? (
        <FlatList
          style={{ width: '100%' }}
          data={groups}
          renderItem={({ item }) => <GroupCard item={item} />}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '600',
              color: colors.placeholder,
            }}>
            No Groups.
          </Text>
        </View>
      )}
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
          onPress={() => refRBSheet.current.open()}>
          <FeatherIcon name="plus" size={32} color={colors.white} />
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
        height={Dimensions.get('window').height * 0.85}
        animationType="slide">
        <ScrollView>
          <CreateNewGroup
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
                PubSub.publish(PubSubEvents.OnGroupCreated, null);
              }
            }}
          />
        </ScrollView>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 44,
    bottom: 8,
  },
});

export default HomeScreen;
