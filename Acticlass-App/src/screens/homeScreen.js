import React from 'react';
import { colors } from '../common/colors';
import { ScrollView, View, StyleSheet, Text, TextInput, Pressable, Button, TouchableOpacity, SafeAreaView, Image, FlatList } from "react-native";
import RBSheet from 'react-native-raw-bottom-sheet';
import CreateNewGroup from '../components/createNewGroupSheet';
import { Dimensions } from 'react-native'
import Navbar from '../components/navBar';
import groupData from '../mock/groupData';
import FeatherIcon from 'react-native-vector-icons/Feather';
import GroupCard from '../components/groupCard';

const HomeScreen = ({ navigation }) => {
    const refRBSheet = React.createRef();
    return (
        <View style={styles.container}>
            <Navbar title={"Home"}></Navbar>
            <FlatList style={{ width: '100%' }}
                data={groupData}
                renderItem={({ item }) =>
                    <GroupCard item={item} />
                }
            />
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
                        backgroundColor: 'rgba(0,0,0,0.2)'
                    },
                    draggableIcon: {
                        backgroundColor: colors.placeholder
                    }
                }}
                height={Dimensions.get('window').height * 0.85}
                animationType='slide'
            >
                <ScrollView>
                    <CreateNewGroup cb={(isDone) => {
                        if (isDone) refRBSheet.current.close();
                    }} />
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
