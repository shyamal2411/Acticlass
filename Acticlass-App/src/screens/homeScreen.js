import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from '../navigation/Navbar';
import BottomBar from '../navigation/BottomBar';
import BottomBarItem from '../navigation/BottomBarItem';
import Home from '../Assets/Home.png';
import SettingsIcon from '../Assets/SettingsIcon.png';
import StateImage from '../Assets/StateImage.png';
import HomeScreen2 from './homeScreen2';
import { colors } from '../common/colors';
import RBSheet from 'react-native-raw-bottom-sheet';
import CreateNewGroup from './createNewGroupSheet';
import { Dimensions } from 'react-native';

const HomeScreen = () => {
    const refRBSheet = React.createRef();
    const data = [
        {
            groupName: 'Group 1',
            status: 'On going',
            radius: '50 m',
            passingPoints: '500',
            points: '257',
        },
        {
            groupName: 'Group 2',
            status: 'Completed',
            radius: '75 m',
            passingPoints: '750',
            points: '420',
        },
        {
            groupName: 'Group 2',
            status: 'Completed',
            radius: '75 m',
            passingPoints: '750',
            points: '420',
        },
        {
            groupName: 'Group 2',
            status: 'Completed',
            radius: '75 m',
            passingPoints: '750',
            points: '420',
        },
        {
            groupName: 'Group 2',
            status: 'Completed',
            radius: '75 m',
            passingPoints: '750',
            points: '420',
        },
        {
            groupName: 'Group 2',
            status: 'Completed',
            radius: '75 m',
            passingPoints: '750',
            points: '420',
        },
        {
            groupName: 'Group 2',
            status: 'Completed',
            radius: '75 m',
            passingPoints: '750',
            points: '420',
        },
    ];

    function extractInitials(input) {
        const words = input.split(' ');
        const initials = words.map(word => word[0]).join('');
        return initials;
    }

    return (
        <View style={styles.container}>
            <Navbar
                profileImageSource={require('../Assets/dummyImage.jpg')}
                title="Home"
            />
            <ScrollView style={styles.Scroll}>
                {data.map((item, index) => (
                    <HomeScreen2 key={index} data={item} />
                ))}
            </ScrollView>
            <TouchableOpacity
                onPress={() => refRBSheet.current.open()}
                style={{
                    borderWidth: 1,
                    borderColor: colors.light,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '56px',
                    position: 'absolute',
                    bottom: 64,
                    right: 36,
                    height: '56px',
                    backgroundColor: colors.white,
                    borderRadius: 100,
                }}>
                <Icon name="pluscircle" size={56} color="purple" />
            </TouchableOpacity>

            <BottomBar>
                <BottomBarItem
                    icon={<Image source={Home} style={styles.ImageStyle} />}
                    active={true}
                    onPress={() => { }}
                />
                <BottomBarItem
                    icon={<Image source={StateImage} style={styles.ImageStyle} />}
                    label="Screen 2"
                    active={false}
                    onPress={() => { }}
                />
                <BottomBarItem
                    icon={<Image source={SettingsIcon} style={styles.ImageStyle} />}
                    label="Screen 3"
                    active={false}
                    onPress={() => { }}
                />
            </BottomBar>
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                    container: { backgroundColor: colors.secondary },
                    wrapper: {
                        backgroundColor: 'transparent',
                    },
                    draggableIcon: {
                        backgroundColor: '#000',
                    },
                }}
                height={Dimensions.get('window').height * 0.85}
                animationType="slide">
                <ScrollView>
                    <CreateNewGroup
                        cb={isDone => {
                            if (isDone) refRBSheet.current.close();
                        }}
                    />
                </ScrollView>
            </RBSheet>
        </View>
    );
    // return (
    //   <View style={styles.container}>
    //     <Text style={{color: colors.black}}>Home Screen</Text>

    //     <View>
    //       <TouchableOpacity
    //         style={{
    //           borderWidth: 1,
    //           borderColor: 'rgba(0,0,0,0.2)',
    //           alignItems: 'center',
    //           justifyContent: 'center',
    //           width: 70,
    //           height: 70,
    //           backgroundColor: '#fff',
    //           borderRadius: 50,
    //         }}
    //         onPress={() => refRBSheet.current.open()}></TouchableOpacity>
    //       <RBSheet
    //         ref={refRBSheet}
    //         closeOnDragDown={true}
    //         closeOnPressMask={true}
    //         customStyles={{
    //           container: {backgroundColor: colors.secondary},
    //           wrapper: {
    //             backgroundColor: 'transparent',
    //           },
    //           draggableIcon: {
    //             backgroundColor: '#000',
    //           },
    //         }}
    //         height={Dimensions.get('window').height * 0.85}
    //         animationType="slide">
    //         <ScrollView>
    //           <CreateNewGroup
    //             cb={isDone => {
    //               if (isDone) refRBSheet.current.close();
    //             }}
    //           />
    //         </ScrollView>
    //       </RBSheet>
    //     </View>
    //   </View>
    // );
};

const styles = StyleSheet.create({
    ImageStyle: {
        width: 20,
        height: 20,
    },
    Scroll: {
        height: '80%',
    },
});

export default HomeScreen;
