import React, { useState } from 'react';
import { DB } from '../../utils/DBConnect';
import { useNavigation } from 'expo-router';
import { addDoc,collection } from 'firebase/firestore';
import { Button, TextInput, Text} from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { View, StyleSheet, ScrollView, } from 'react-native';
import TopAppBar from './TopAppBar';

const AddClass = () => {

    const navigation = useNavigation();
    // const Lottie = Platform.OS === 'web' ? LottieWeb : LottieNative; 
    const [classId, setClassId] = useState('');
    const [teacherId, setTeacherId] = useState('');
    const [className, setClassName] = useState('');
    const [alStream, setAlStream] = useState('');
    const [subject, setSubject] = useState('');
    const [batch, setBatch] = useState();
    const [instituteName, setInstituteName] = useState('');
    const [currentLesson, setCurrentLesson] = useState('');

    const [openStream, setOpenStream] = useState(false);
    const [openSubject, setOpenSubject] = useState(false);

    const [loading, setLoading] = useState(false); 

    const handleCongrates = () => {
        setLoading(true); 
        setTimeout(() => {
            setLoading(false); 
            navigation.navigate('TeaLogin'); 
        }, 2000); 
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Image
                    source={require("../../assets/images/SearchLesson/congrates.png")}
                    style={styles.logoutImg}
                ></Image>
                <Text style={styles.loadingText}>Class Added Successfully !</Text>
            </View>
        );
    }

    const [alStreamItems, setAlStreamItem] = useState([
        { label: 'Physical Sciences', value: 'Physical Sciences' },
        { label: 'Biology', value: 'Biology' },
        { label: 'Commerce', value: 'Commerce' },
        { label: 'Arts', value: 'Arts' },
        { label: 'Technology', value: 'Technology' },
    ]);

    const [subjectItems, setSubjectItem] = useState([
        { label: 'Combined Mathematics', value: 'Combined Mathematics' },
        { label: 'Combined Mathematics - Pure', value: 'Combined Mathematics - Pure' },
        { label: 'Combined Mathematics - Applied', value: 'Combined Mathematics - Applied' },
        { label: 'Biology', value: 'Biology' },
        { label: 'Physics', value: 'Physics' },
        { label: 'Chemistry', value: 'Chemistry' },
        { label: 'Logic', value: 'Logic' },
        { label: 'Political Sciences', value: 'Political Sciences' },
        { label: 'English Literature', value: 'English Literature' },
        { label: 'History', value: 'History' },
        { label: 'Business Studies', value: 'Business Studies' },
        { label: 'Accounting', value: 'Accounting' },
        { label: 'Economic Development', value: 'Economic Development' },
        { label: 'Business Statistics', value: 'Business Statistics' },
        { label: 'Languages', value: 'Languages' },
        { label: 'Media and communication studies', value: 'Media and communication studies' },
        { label: 'Buddhist civilization', value: 'Buddhist civilization' },
        { label: 'Christian civilization', value: 'Christian civilization' },
        { label: 'Hindu Civilization', value: 'Hindu Civilization' },
        { label: 'Greek and Roman Civilization', value: 'Greek and Roman Civilization' },
        { label: 'Dancing', value: 'Dancing' },
        { label: 'Arts', value: 'Arts' },
        { label: 'Geography', value: 'Geography' },
        { label: 'Home Science', value: 'Home Science' },
        { label: 'Engineering Technology', value: 'Engineering Technology' },
        { label: 'Bio-system Technology', value: 'Bio-system Technology' },
        { label: 'Science for Technology', value: 'Science for Technology' },
        { label: 'Mathematics', value: 'Mathematics' },
        { label: 'English', value: 'English' },
        { label: 'Physical Education', value: 'Physical Education' },
        { label: 'Drama', value: 'Drama' },
        { label: 'Music', value: 'Music' },
        { label: 'Agriculture', value: 'Agriculture' },
        { label: 'Information and Communication Techhnology', value: 'Information and Communication Techhnology' },
    ]);

    const handleSubmit = () => {

        console.log('Class:', {classId, teacherId, className, alStream, subject, batch, instituteName, currentLesson});

        addDoc(collection(DB, "class"),{
            classId: classId,
            teacherId: teacherId,
            className: className,
            alStream: alStream,
            subject: subject,
            batch: batch,
            instituteName: instituteName,
            currentLesson: currentLesson
        }).then(() => {
            console.log('New class added');
            navigation.navigate('ViewClasses')
        }).catch((err) => {
            console.log(err);
        });
    };

    return (
        <ScrollView style={styles.bgColor}>
            <TopAppBar 
                title="Add a class" 
                onBackPress={() => navigation.goBack()} 
            />

            <View style={styles.container1}>
                <Text 
                    style={{
						fontSize: 20,
                        textAlign: 'center',
						marginLeft: 20,
						fontWeight: 'bold',
						color: '#7781FB',
					}}
                >Add a new class to your pocket</Text>
                {/* <Lottie 
                    animationData={Platform.OS === 'web' ? animation : undefined} // Web-specific property
                    source={Platform.OS !== 'web' && animation} // Native-specific property
                    autoPlay
                    loop
                    style={styles.animation}
                /> */}
                {/* <Icon name='account' size={24} color='#7781FB' style={styles.icon}></Icon>
                <Text style={styles.emoji}>😂</Text> */}
                <View style={styles.container2}>
                    <View style={styles.row}>
                        <TextInput
                            style={styles.input}
                            label="Enter Class Id"
                            value={classId}
                            onChangeText={setClassId}
                        />
                        <TextInput
                            style={styles.input}
                            label="Enter Your name to be displayed"
                            value={teacherId}
                            onChangeText={setTeacherId}
                        />
                    </View>
                    <TextInput
                        style={styles.input}
                        label="Enter a class Name"
                        value={className}
                        onChangeText={setClassName}
                    />
                    <View style={styles.pickerContainer1}>
                        <Text style={{ marginTop: 10 }}>Select A/L stream</Text>
                        <DropDownPicker
                            open={openStream}
                            value={alStream}
                            items={alStreamItems}
                            setOpen={setOpenStream}
                            setValue={setAlStream}
                            setItems={setAlStreamItem}
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownContainer}
                        />
                    </View>
                    <View style={styles.pickerContainer2}>
                        
                        <Text style={{ marginTop: 5 }}>Select A/L subject</Text>
                        <DropDownPicker
                            open={openSubject}
                            value={subject}
                            items={subjectItems}
                            setOpen={setOpenSubject}
                            setValue={setSubject}
                            setItems={setSubjectItem}
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownContainer}
                        />
                    </View>
                    <Text style={{
                        fontWeight: 'bold',
                        marginBottom: 5,
                        color: '#7781FB',
                    }}>Current lesson of the class which updates everytime
                    </Text>
                    <View style={styles.card}>
                        <Text style={{
                            fontSize: 17,
                            textAlign: 'center',
                            marginLeft: 20,
                            fontWeight: 'bold',
                            color: '#7781FB',
                            marginTop: 5
					    }}>Current Lesson</Text>
                        <TextInput style={styles.inputBox}
                            value={currentLesson}
                            onChangeText={setCurrentLesson}
                        />
                    </View>
                    <View style={styles.row}>
                        <TextInput
                            style={styles.input}
                            label="Class Batch"
                            value={batch}
                            onChangeText={setBatch}
                        />
                        <TextInput
                            style={styles.input}
                            label="Educational instituteName Name"
                            value={instituteName}
                            onChangeText={setInstituteName}
                        />
                    </View>   
                </View>
                
                <View style={styles.buttonContainer}>
                    <Button icon="school" mode="contained" onPress={handleSubmit} style={styles.buttonStyle}>
                            Add New Class
                    </Button>
                </View>
            </View> 
        </ScrollView>
    );
    
};

const styles = StyleSheet.create({
    container1: {
        flex: 1,
        padding: 10,
    },
    container2: {
        flex: 1,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 15
    },
    emoji: {
        fontSize: 24,
    },
    card:{
        borderColor: '#404bc9',
        borderWidth: 2,
        borderRadius: 20,
        margin: 4
    },
    icon:{
        marginRight: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    animation: {
        width: 300,
        height: 300,
    },
    bgColor: {
        backgroundColor: 'white',
    },
    input: {
        fontSize: 15,
        flex: 1,
        height: 50,
        borderColor: 'transparent',
        borderWidth: 1,
        marginBottom: 5,
        marginRight: 10,
        fontFamily: 'Roboto',
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
    inputBox: {
        flex: 1, 
        padding: 10,
        textAlign: 'center',
        color: '#7781FB',
        marginBottom: 5,
        marginLeft:15,
        marginRight:20,
        marginTop: 5,
        backgroundColor: 'white'
    },
    pickerContainer1: {
        marginBottom: 10,
        zIndex: 1,
        marginRight: 10,
    },
    pickerContainer2: {
        marginBottom: 10,
        zIndex: 1,
        marginRight: 10,
    },
    dropdown: {
        backgroundColor: 'white',
        fontFamily: 'Roboto Light',
        borderWidth: 0,
        borderBottomWidth: 0.3,
        borderBottomColor: 'gray',
        borderRadius: 0,
        backgroundColor: '#dfdfe6',
        borderRadius: 12,
        marginTop: 5,
    },
    dropdownContainer: {
        backgroundColor: 'white',
        borderColor: 'gray',
        borderTopWidth: 0,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 15,
    },
    buttonStyle: {
        height: 50,
        justifyContent: 'center',
        backgroundColor: '#7781FB',
    },
    
});

export default AddClass;