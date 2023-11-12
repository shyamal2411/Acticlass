import {StackActions} from '@react-navigation/native';
import randomColor from 'randomcolor';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {colors} from '../common/colors';
import {PubSubEvents, ROLES} from '../common/constants';
import groupServices from '../services/groupServices';
import Navbar from '../components/navBar';
import StudentCard from '../components/studentCard';
import jsonQuery from 'json-query';

const LeaderBoard = ({navigation}) => {
  const [searchText, setSearchText] = useState('');

  // const mockStudents = [
  //   {
  //     rank: '1',
  //     StudentName: 'Kuldeep',
  //     Points: '100',
  //     EmailId: 'abc@gmail.com',
  //   },
  //   {rank: '2', StudentName: 'Nisarg', Points: '200', EmailId: 'abc@gmail.com'},
  //   {
  //     rank: '3',
  //     StudentName: 'Shyamal',
  //     Points: '300',
  //     EmailId: 'abc@gmail.com',
  //   },
  //   {
  //     rank: '4',
  //     StudentName: 'Venkata',
  //     Points: '400',
  //     EmailId: 'abc@gmail.com',
  //   },
  //   {
  //     rank: '5',
  //     StudentName: 'Vaibhav',
  //     Points: '500',
  //     EmailId: 'abc@gmail.com',
  //   },
  //   {
  //     rank: '6',
  //     StudentName: 'Darshit',
  //     Points: '600',
  //     EmailId: 'abc@gmail.com',
  //   },
  //   {
  //     rank: '7',
  //     StudentName: 'Bhautik',
  //     Points: '700',
  //     EmailId: 'abc@gmail.com',
  //   },
  //   {
  //     rank: '8',
  //     StudentName: 'Dhruvik',
  //     Points: '800',
  //     EmailId: 'abc@gmail.com',
  //   },
  //   {rank: '9', StudentName: 'Jeet', Points: '900', EmailId: 'abc@gmail.com'},
  //   {rank: '10', StudentName: 'Rushi', Points: '800', EmailId: 'abc@gmail.com'},
  //   {
  //     rank: '11',
  //     StudentName: 'Drashti',
  //     Points: '700',
  //     EmailId: 'abc@gmail.com',
  //   },
  //   {rank: '12', StudentName: 'Yash', Points: '600', EmailId: 'abc@gmail.com'},
  // ];
  const [students, setStudents] = useState(members);

  updateSearch = searchText => {
    setSearchText(searchText);
  };

  const [members, setMembers] = useState([]);
  const refreshMembers = () => {
    groupServices.getMembers(groupId, (err, res) => {
      if (err) {
        console.error(err);
      } else {
        // TODO: short members by points
        setMembers(res.members);
        console.log(res, '  res');
        console.log(res.members, '  members');
      }
    });
    setMembers(groupMembersData);
  };
  useEffect(() => {
    refreshMembers();
    const tokens = [];
    const events = [
      PubSubEvents.ONAppComesToForeground,
      PubSubEvents.OnGroupJoined,
      PubSubEvents.OnGroupLeft,
    ];
    events.forEach(event => {
      tokens.push(PubSub.subscribe(event, refreshMembers));
    });
    return () => {
      tokens.forEach(token => PubSub.unsubscribe(token));
    };
  }, []);

  if (searchText.trim() === '') {
    setStudents(members);
  } else {
    const query = `[name~*${searchText}]|[email~*${searchText}]`;
    const result = jsonQuery(query, {data: members}).value;
    setStudents(result);
  }

  return (
    <View style={styles.container}>
      <Navbar prefixIcon={true} title={'LeaderBoard'}></Navbar>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.placeholder}
          placeholder="Search by name or email"
          onChangeText={updateSearch}
          value={searchText}
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={{fontSize: 16, color: colors.white}}>Search</Text>
        </TouchableOpacity>
      </View>

      {students.length > 0 ? (
        <FlatList
          style={{width: '100%'}}
          data={students}
          renderItem={({item}) => (
            <StudentCard navigation={navigation} item={item} />
          )}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
