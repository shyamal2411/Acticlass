import randomColor from 'randomcolor';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { colors } from '../common/colors';
import { PubSubEvents } from '../common/constants';
import Navbar from '../components/navBar';
import StudentCard from '../components/studentCard';
import groupServices from '../services/groupServices';

const LeaderBoard = ({ navigation, route }) => {
  const { groupId } = route.params;
  const [searchText, setSearchText] = useState('');
  const [leaderBoardData, setLeaderBoardData] = useState([]);
  const [students, setStudents] = useState([]);
  useEffect(() => {
    let text = searchText.trim().toLowerCase();
    if (text === '') {
      setStudents(leaderBoardData);
    } else {
      const result = leaderBoardData.filter(
        student =>
          student.name.toLowerCase().includes(text) ||
          student.email.toLowerCase().includes(text),
      );
      setStudents(result);
    }
  }, [searchText]);

  const refreshMembers = () => {
    groupServices.getMembers(groupId, (err, res) => {
      if (err) {
        console.error(err);
      } else {
        let data = res.members.sort((a, b) => b.points - a.points);
        data = data.map((student, index) => {
          student.color = randomColor({
            luminosity: 'dark',
            format: 'rgba',
            alpha: 0.5,
          });
          student.index = index + 1;
          return student;
        });
        setLeaderBoardData(data);
        setStudents(data);
      }
    });
  };

  useEffect(() => {
    refreshMembers();
    const tokens = [];
    const events = [
      PubSubEvents.ONAppComesToForeground,
      PubSubEvents.OnGroupJoined,
      PubSubEvents.OnGroupLeft,
      PubSubEvents.OnGroupMemberKicked,
      PubSubEvents.OnPointsUpdated
    ];
    events.forEach(event => {
      tokens.push(PubSub.subscribe(event, refreshMembers));
    });
    return () => {
      tokens.forEach(token => PubSub.unsubscribe(token));
    };
  }, []);

  return (
    <View style={styles.container}>
      <Navbar prefixIcon={true} title={'LeaderBoard'}></Navbar>
      <View style={styles.searchContainer}>
        <Icon
          name="search"
          size={24}
          color={colors.placeholder}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          value={searchText}
          placeholderTextColor={colors.placeholder}
          placeholder="Search by name or email"
          onChangeText={setSearchText}
        />
      </View>

      {students.length > 0 ? (
        <FlatList
          style={{ width: '100%' }}
          data={students}
          renderItem={({ item }) => (
            <StudentCard
              navigation={navigation}
              item={item}
              groupId={groupId}
            />
          )}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '600',
              color: colors.placeholder,
            }}>
            No students.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: colors.placeholder,
    borderWidth: 1,
    height: 52,
    borderRadius: 4,
    marginHorizontal: 28,
    marginTop: 16,
  },
  input: {
    color: colors.black,
    flex: 1,
    height: 40,
    marginRight: 8,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: colors.primary,
    height: '100%',
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignContent: 'center',
  },
  searchIcon: {
    padding: 10,
  },
});

export default LeaderBoard;
