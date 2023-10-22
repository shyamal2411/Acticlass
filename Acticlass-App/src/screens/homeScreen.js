import React from 'react';
import { colors } from '../common/colors';
import { ScrollView, View, StyleSheet, Text, TextInput, Pressable, Button, TouchableOpacity, SafeAreaView, Image } from "react-native";
import RBSheet from 'react-native-raw-bottom-sheet';
import CreateNewGroup from './createNewGroupSheet';
import { Dimensions } from 'react-native'


const HomeScreen = () => {
    const refRBSheet = React.createRef();
    return (
        <View style={styles.container}>
            <Text style={{ color: colors.black }}>Home Screen</Text>


            <View>
                <TouchableOpacity
                    style={{
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,0.2)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 70,
                        height: 70,
                        backgroundColor: '#fff',
                        borderRadius: 50,
                    }}
                    onPress={() => refRBSheet.current.open()}
                >
                </TouchableOpacity>
                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    customStyles={{
                        container: { backgroundColor: colors.secondary },
                        wrapper: {
                            backgroundColor: "transparent"
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

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default HomeScreen;
