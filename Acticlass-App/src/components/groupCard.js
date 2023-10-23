import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../common/colors';
import randomColor from 'randomcolor';
import FeatherIcon from 'react-native-vector-icons/Feather';

const GroupCard = ({ item }) => {

    const groupNameInitials = (groupName) => {
        groupName = groupName.split(' ');
        if (groupName.length > 1) {
            return groupName[0][0] + groupName[1][0];
        }
        return groupName[0];
    }


    return (
        <View style={[styles.container, {
            shadowColor: colors.placeholder, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5,
            shadowRadius: 3.84, elevation: 5, borderRadius: 10,
            marginHorizontal: 30, backgroundColor: colors.secondary, height: 100, marginVertical: 16
        }]} >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: '100%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: '100%' }}>
                    <View style={{
                        width: 60, height: 60, marginVertical: 20,
                        marginLeft: 20,
                        backgroundColor: randomColor(
                            {
                                luminosity: 'dark',
                                format: 'rgba',
                                alpha: 0.5
                            }
                        ),
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 4
                    }}>
                        <Text style={{
                            fontSize: 28,
                            fontWeight: '600',
                            color: colors.white
                        }}>
                            {groupNameInitials(item.Name)}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'column', alignItems: 'flex-start', width: '100%', height: '100%' }}>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: colors.black, marginLeft: 16, marginTop: 20 }}>{item.Name}</Text>
                        <Text style={{ fontSize: 14, color: colors.black, marginLeft: 16 }}>Passing Points: {item.PassingPoint}</Text>
                        <Text style={{ fontSize: 14, color: colors.black, marginLeft: 16 }}>Radius: {item.Radius}</Text>
                    </View>
                    <View style={{ position: 'absolute', right: 15, top: 15, justifyContent: 'center', alignItems: 'flex-end' }}>
                        <TouchableOpacity style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}>
                            <FeatherIcon name="more-horizontal" size={24} color={colors.inactive} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 12, color: colors.inactive, textAlign: 'right' }}>{item.Points} Points</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
});

export default GroupCard;
