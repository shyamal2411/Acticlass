import React, {useEffect, useState} from 'react';
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
  Dimensions,
} from 'react-native';
import {colors} from '../common/colors';
import RBSheet from 'react-native-raw-bottom-sheet';
import RewardRequestOnAcceptSheet from './rewardRequestOnAcceptSheet';
import RequestDeclineCard from './requestdeclineCard';
import groupServices from '../services/groupServices';
const RewardRequestSheet = ({
  item,
  group,
  refRBSheetPrev,
  setIsButtonClickable,
  cb,
}) => {
  const refRBSheet = React.createRef();
  const [studentDetail, setStudentDetail] = useState({});
  //console.log(item);
  useEffect(() => {
    groupServices.getMemberDetails({activityId: item.id}, (err, res) => {
      setStudentDetail(res);
    });
  }, []);

  const handleAccept = () => {
    console.log('Accept');
    refRBSheet.current.open();
  };

  const handleDecline = () => {
    refRBSheetPrev.current.close();
    setIsButtonClickable(true);

    socketService.rejectRequest({
      groupId: group.id,
      requestId: item.id,
      points: group.penalty,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reward Request</Text>

      <View style={styles.dataContainer}>
        <View style={styles.LabelColumn}>
          <Text style={styles.cellLabel}>Name</Text>
          <Text style={styles.cellLabel}>Email</Text>
          <Text style={styles.cellLabel}>Points</Text>
        </View>

        <View style={styles.valueColumn}>
          <Text style={styles.cellValue}>{studentDetail.name}</Text>
          <Text style={styles.cellValue}>{studentDetail.email}</Text>
          <Text style={styles.cellValue}>{studentDetail.points}</Text>
        </View>
      </View>

      <View style={{paddingVertical: 8, paddingHorizontal: 40}}>
        <TouchableOpacity style={styles.button} onPress={handleAccept}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
      </View>

      <View style={{paddingVertical: 8, paddingHorizontal: 40}}>
        <TouchableOpacity style={styles.buttonDecline} onPress={handleDecline}>
          <Text style={styles.buttonText}>Decline</Text>
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
        height={Dimensions.get('window').height * 0.45}
        animationType="slide">
        <View>
          <RewardRequestOnAcceptSheet
            item={item}
            group={group}
            refRBSheetPrevPrev={refRBSheetPrev}
            refRBSheetPrev={refRBSheet}
            setIsButtonClickable={setIsButtonClickable}
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
    alignItems: 'left',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
  },

  dataContainer: {
    marginTop: 30,
    flexDirection: 'row',
  },

  title: {
    alignSelf: 'center',
    marginVertical: 3,
    color: colors.black,
    fontSize: 34,
    fontWeight: '600',
  },

  LabelColumn: {
    flexDirection: 'column',
  },

  valueColumn: {
    flexDirection: 'column',
  },

  cellLabel: {
    marginBottom: 16,
    marginLeft: 50,
    fontWeight: '500',
    color: colors.black,
    fontSize: 18,
    fontStyle: 'normal',
  },

  cellValue: {
    marginBottom: 16,
    marginLeft: 20,
    color: colors.black,
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '400',
  },

  button: {
    backgroundColor: colors.primary,
    width: '100%',
    height: 48,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  buttonDecline: {
    backgroundColor: colors.inactive,
    width: '100%',
    height: 48,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RewardRequestSheet;
