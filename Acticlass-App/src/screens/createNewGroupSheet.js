import React, { useState } from "react";
import { ScrollView, View, StyleSheet, Text, TextInput, Pressable, Button, TouchableOpacity, SafeAreaView } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { colors } from "../common/colors";
import { Formik } from 'formik';

const CreateNewGroup = ({cb}) => {
    const [frameDropdownOpen, setFrameDropdownOpen] = useState(false);
    const [frameDropdownValue, setFrameDropdownValue] = useState();
    const [frameDropdownItems, setFrameDropdownItems] = useState([
        { value: "0", label: "0" },
        { value: "15", label: "15" },
        { value: "30", label: "30" },
        { value: "60", label: "60" },
    ]);
    const [selectedValue, setSelectedValue] = useState(null);

    handleClickOnCreate = (values) => {
        console.log("Group Creation",values);
        //TODO: handle validation and group creation API call
        if(cb){
            cb(true);
        }
    }
    return (
        <View style={styles.container}>
            
            <SafeAreaView style={{
                        backgroundColor: colors.secondary,
                        width: '100%'
                        }}>
                <Text style={styles.title}>Create Group</Text>
                
                <Formik initialValues={
                            {   name: '',
                                radius: '',
                                passingPoints : '',
                                attendanceFrequency : '',
                                attendanceRewards : '',
                                falseRequstPenalty :''  }
                        }
                        onSubmit={handleClickOnCreate}
                        // TODO: define validationSchema for group form fields
                        // Syntax : validationSchema={function}, formic documentation for more.
                >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                
                <View>
                    <View style={{ paddingVertical: 8, paddingHorizontal: 40 }}>
                        <Text style={styles.inputTitle}>Name</Text>
                    
                        <TextInput
                        style={styles.input}
                        placeholder="Enter group name"
                        placeholderTextColor="#9e9292"
                        value={values.name}
                        onChangeText={handleChange('name')} />
                    </View>
            

                    <View style={{ paddingVertical: 8, paddingHorizontal: 40 }}>
                        <Text style={styles.inputTitle}>{`Radius `}</Text>
                        <TextInput
                        style={styles.input}
                        placeholder="Enter radius in meters"
                        placeholderTextColor="#9e9292"
                        value={values.radius}
                        onChangeText={handleChange('radius')}
                        />
                    </View>
                    
                    
                    <View style={{ paddingVertical: 8, paddingHorizontal: 40 }}>
                        <Text style={styles.inputTitle}>
                        Passing Points
                        </Text>
                        <TextInput
                        style={styles.input}
                        placeholder="Enter passing points"
                        placeholderTextColor="#9e9292"
                        value={values.passingPoints}
                        onChangeText={handleChange('passingPoints')}
                        />
                    </View>
                    
                    
                    <View style={{ paddingVertical: 8, paddingHorizontal: 40 }}>
                        <Text style={styles.inputTitle}>
                        Attendance Frequency
                        </Text>
                        <View>
                            <DropDownPicker
                                style={{backgroundColor: 'white',
                                        fontSize: 16,
                                        color: 'black',
                                        height: 48,
                                        borderColor: '#ccc',
                                        Border : null,
                                        marginTop :4}}
                                
                                dropDownContainerStyle={{borderColor:'#ccc'}}
                                open={frameDropdownOpen}
                                setOpen={setFrameDropdownOpen}
                                value={frameDropdownValue}
                                setValue={setFrameDropdownValue}
                                onChangeValue={(val)=>{
                                    handleChange('attandanceFrequency')(val);
                                }}
                                placeholder="Select frequency"
                                listMode="SCROLLVIEW"
                                items={frameDropdownItems}                                
                            />

                            {/* <View style={{ padding: 20 }}>
                                <Picker
                                selectedValue={selectedValue}
                                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                                placeholder = "Select Frequency"
                                >
                                <Pic
                                <Picker.Ite label="Option 1" value={'0'} />
                                <Picker.Item label="Option 2" value={'15'} />
                                <Picker.Item label="Option 3" value={'30'} />
                                <Picker.Item label="Option 4" value={'60'} />
                                </Picker>
                            </View> */}
                        </View>
                    </View>
                    
                    
                    <View style={{ paddingVertical: 8, paddingHorizontal: 40 }}>
                        <Text style={styles.inputTitle}>
                        Attendance Reward
                        </Text>
                        <TextInput
                        style={styles.input}
                        placeholder="Enter Attendance Reward points"
                        placeholderTextColor="#9e9292"
                        value={values.attendanceRewards}
                        onChangeText={handleChange('attendanceRewards')}
                        />
                    </View>
                    
                    
                    <View style={{ paddingVertical: 8, paddingHorizontal: 40 }}>
                        <Text style={styles.inputTitle}>
                        False Request Penalty
                        </Text>
                        <TextInput
                        style={styles.input}
                        placeholder="Enter penalty points"
                        placeholderTextColor="#9e9292"
                        value={values.falseRequstPenalty}
                        onChangeText={handleChange('falseRequstPenalty')}
                        />
                    </View>
                    
                    
                    <View style={{ paddingVertical: 8, paddingHorizontal: 40 }}> 
                        
                        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Create</Text>

                        </TouchableOpacity>
                    </View>
            </View>                
            )}

            </Formik>                
                

            </SafeAreaView>
   
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex : 1,
        alignItems: 'left',
        justifyContent: 'center',
        backgroundColor: colors.secondary,
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
    title: {
        
        alignSelf: 'center',
        marginVertical: 3,
        color: 'black',
        fontSize: 34,
        fontWeight: '500',
      },
    inputTitle : {
        fontSize: 16,
        color: 'black',
        marginLeft: 10 
    }
})

export default CreateNewGroup;
