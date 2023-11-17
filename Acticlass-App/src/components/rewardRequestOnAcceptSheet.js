import React, {useState} from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Button,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import {colors} from '../common/colors';
import {log} from 'console';
import {isEmpty, toNumber} from 'lodash';

const RewardRequestOnAcceptSheet = ({
  item,
  group,
  refRBSheetPrevPrev,
  refRBSheetPrev,
  setIsButtonClickable,
  cbcb,
}) => {
  const [reward, setReward] = React.useState('');

  const getRewards = () => {
    return reward === ' ' ? 0 : toNumber(reward);
  };
  const handleDone = () => {
    refRBSheetPrev.current.close();
    refRBSheetPrevPrev.current.close();
    setIsButtonClickable(true);
    socketService.acceptRequest({
      groupId: group.id,
      requestId: item.id,
      points: getRewards(),
    });
  };

  const handleChange = newReward => {
    setReward(newReward);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reward Request</Text>

      <View style={{paddingVertical: 8, paddingHorizontal: 40, marginTop: 28}}>
        <Text style={styles.inputTitle}>Reward</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Reward Points"
          placeholderTextColor={colors.placeholder}
          onChangeText={handleChange}
          value={reward}
          keyboardType={'number-pad'}
        />
      </View>

      <View style={styles.readyButtons}>
        <TouchableOpacity
          style={[styles.readyButtonsTextButton, {marginLeft: 91}]}
          onPress={() => {
            setReward('10');
          }}>
          <Text style={styles.readyButtonsText}>10</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.readyButtonsTextButton, {marginLeft: 24}]}
          onPress={() => {
            setReward('20');
          }}>
          <Text style={styles.readyButtonsText}>20</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.readyButtonsTextButton, {marginLeft: 24}]}
          onPress={() => {
            setReward('30');
          }}>
          <Text style={styles.readyButtonsText}>30</Text>
        </TouchableOpacity>
      </View>

      <View style={{paddingVertical: 8, paddingHorizontal: 40}}>
        <TouchableOpacity style={styles.button} onPress={handleDone}>
          <Text style={styles.buttonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'left',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
  },

  title: {
    alignSelf: 'center',
    marginVertical: 3,
    color: colors.black,
    fontSize: 34,
    fontWeight: '600',
  },
  inputTitle: {
    fontSize: 16,
    color: 'black',
    marginLeft: 4,
  },
  input: {
    backgroundColor: 'white',
    fontSize: 16,
    color: 'black',
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginVertical: 4,
    paddingHorizontal: 16,
  },

  readyButtons: {
    marginTop: 20,
    flexDirection: 'row',
  },

  button: {
    backgroundColor: colors.primary,
    width: '100%',
    height: 48,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },

  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  readyButtonsTextButton: {
    backgroundColor: '#D9D9D9',
    width: 66,
    height: 39,
    borderWidth: 0.1,
    //borderRadius: 0.1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  readyButtonsText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: '500',
  },
});

export default RewardRequestOnAcceptSheet;
