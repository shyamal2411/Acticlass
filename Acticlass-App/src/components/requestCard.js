import React, {useState} from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import {colors} from '../common/colors';
import {ROLES} from '../common/constants';
import authService from '../services/authService';
import RBSheet from 'react-native-raw-bottom-sheet';
import RewardRequestSheet from './rewardRequestSheet';
import RequestDeclineCard from './requestdeclineCard';
import RequestApproveCard from './requestapproveCard';

const RequestCard = ({item, group}) => {
  const refRBSheet = React.createRef();
  const [isVisibleDecline, setIsVisibleDecline] = useState(false);
  const [isVisibleAccept, setIsVisibleAccept] = useState(false);
  const [isButtonClickable, setIsButtonClickable] = useState(false);
  const handleRequest = () => {
    if (authService.getRole() === ROLES.TEACHER) {
      //TODO: handle request
      refRBSheet.current.open();
      // socketService.acceptRequest({ groupId: group.id, requestId: item.id, points: 100 }); // just for testing
      // socketService.rejectRequest({ groupId: group.id, requestId: item.id, points: group.penalty }); // just for testing
    }
  };

  const getRequestComponent = () => {
    return (
      <View
        style={[
          styles.row,
          item.isMine ? {flexDirection: 'row-reverse'} : {flexDirection: 'row'},
        ]}>
        <View style={styles.container}>
          <Text style={styles.text}>Raised a Request ✋</Text>
        </View>
      </View>
    );
  };

  const doNothing = () => {};
  const renderDecline = () => {
    //setIsVisible(false);
    socketService.rejectRequest({
      groupId: group.id,
      requestId: item.id,
      points: group.penalty,
    }); // just for testing
  };
  const renderAccept = () => {
    socketService.acceptRequest({
      groupId: group.id,
      requestId: item.id,
      points: 100,
    }); // just for testing
  };
  return (
    <View>
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
          <RewardRequestSheet
            item={item}
            group={group}
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
      {authService.getRole() === ROLES.TEACHER ? (
        <TouchableOpacity onPress={handleRequest} disabled={isButtonClickable}>
          {getRequestComponent()}
        </TouchableOpacity>
      ) : (
        getRequestComponent()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    marginVertical: 14,
    flexDirection: 'row',
    marginHorizontal: 16,
  },
  container: {
    paddingHorizontal: 8,
    height: 28,
    marginLeft: 16,
    borderRadius: 8,
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  text: {
    color: colors.black,
    fontSize: 14,
    fontWeight: '400',
  },
  text_points: {
    color: colors.placeholder,
    fontSize: 12,
  },
});

export default RequestCard;
