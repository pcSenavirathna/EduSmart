import React, { useState, useEffect } from "react";
import { useNavigation } from 'expo-router'; 
import { AppText } from '../../components/AppText';
import { Button, TextInput } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { addDoc, updateDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';
import { DB } from '../../utils/DBConnect';
import { Streams, Subjects, WeekDays } from '../../constants/ClassDetails';
import { StyleSheet, View, ActivityIndicator, Image, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import TimePicker from "../../components/AppTimePicker";
import { KeyboardAvoidingView, Platform, FlatList } from 'react-native';

const AddClass = ({ route }) => {
    const navigation = useNavigation();
    const { classDetails } = route.params || {}; 

    
    const [streamDetails, setStreamDetails] = useState({
        stream: classDetails?.stream || "", 
        open: "",
        items: Streams
    });
    const [subjectDetails, setSubjectDetails] = useState({
        subject: classDetails?.subject || "",
        open: "",
        items: Subjects
    });
    const [classDateDetails, setClassDateDetails] = useState({
        classDate: classDetails?.classDate || "",
        open: "",
        items: WeekDays
    });
    const [latitude, setLatitude] = useState(classDetails?.latitude || 0.0);
    const [longitude, setLongitude] = useState(classDetails?.longitude || 0.0);
    const [selectedLocation, setSelectedLocation] = useState(classDetails ? { latitude: classDetails.latitude, longitude: classDetails.longitude } : null);
    const [region, setRegion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [startTime, setStartTime] = useState(classDetails ? new Date(classDetails.startTime.seconds * 1000) : new Date());
    const [endTime, setEndTime] = useState(classDetails ? new Date(classDetails.endTime.seconds * 1000) : new Date());
    const [teacher, setTeacher] = useState(classDetails?.teacher || '');

    const handleChange = (detailType, field, value) => {
        if (detailType === "stream") {
            setStreamDetails((prevDetails) => ({
                ...prevDetails,
                [field]: value,
            }));
        } else if (detailType === "subject") {
            setSubjectDetails((prevDetails) => ({
                ...prevDetails,
                [field]: value,
            }));
        } else if (detailType === "classDate") {
            setClassDateDetails((prevDetails) => ({
                ...prevDetails,
                [field]: value,
            }));
        }
    };
    
    const getCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        });
        setLoading(false);
    };

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const handleLongPress = (event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedLocation({ latitude, longitude });
        setLongitude(longitude);
        setLatitude(latitude);
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    
    const handleSave = () => {
        if (classDetails) {
            
            const classRef = doc(DB, "classes", classDetails.id);
            updateDoc(classRef, {
                stream: streamDetails.stream,
                subject: subjectDetails.subject,
                classDate: classDateDetails.classDate,
                startTime: startTime,
                endTime: endTime,
                teacher: teacher,
                longitude: longitude,
                latitude: latitude
            })
                .then(() => {
                    console.log('Class updated successfully');
                    navigation.navigate('Home');
                })
                .catch((error) => {
                    console.log('Error updating class:', error);
                });
        } else {
            
            const q = query(collection(DB, "classes"));
            getDocs(q)
                .then((querySnapshot) => {
                    const size = querySnapshot.empty ? 0 : querySnapshot.size;
                    const paddedNumber = (size + 1).toString().padStart(4, '0');
                    var classId = `C${paddedNumber}`;

                    addDoc(collection(DB, "classes"), {
                        id: classId,
                        stream: streamDetails.stream,
                        subject: subjectDetails.subject,
                        classDate: classDateDetails.classDate,
                        startTime: startTime,
                        endTime: endTime,
                        teacher: teacher,
                        longitude: longitude,
                        latitude: latitude
                    })
                        .then(() => {
                            console.log('Class added successfully');
                            navigation.navigate('Home');
                        })
                        .catch((error) => {
                            console.log('Error adding class:', error);
                        });
                })
                .catch((error) => {
                    console.log('Error fetching class data:', error);
                });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <FlatList
                data={[]}
                ListHeaderComponent={
                    <>
                        <View style={styles.pickerContainer1}>
                            <AppText>A/L Stream:</AppText>
                            <DropDownPicker
                                open={streamDetails.open}
                                value={streamDetails.stream}
                                items={streamDetails.items}
                                setOpen={() => handleChange("stream", "open", !streamDetails.open)}
                                setValue={(callback) => handleChange("stream", "stream", callback(streamDetails.stream))}
                                setItems={(callback) => handleChange("stream", "items", callback(streamDetails.items))}
                                style={styles.dropdown}
                                dropDownContainerStyle={styles.dropdownContainer}
                            />
                        </View>

                        <View style={styles.pickerContainer2}>
                            <AppText>Subject:</AppText>
                            <DropDownPicker
                                open={subjectDetails.open}
                                value={subjectDetails.subject}
                                items={subjectDetails.items}
                                setOpen={() => handleChange("subject", "open", !subjectDetails.open)}
                                setValue={(callback) => handleChange("subject", "subject", callback(subjectDetails.subject))}
                                setItems={(callback) => handleChange("subject", "items", callback(subjectDetails.items))}
                                style={styles.dropdown}
                                dropDownContainerStyle={styles.dropdownContainer}
                            />
                        </View>

                        <View style={styles.pickerContainer3}>
                            <AppText>Class Date:</AppText>
                            <DropDownPicker
                                open={classDateDetails.open}
                                value={classDateDetails.classDate}
                                items={classDateDetails.items}
                                setOpen={() => handleChange("classDate", "open", !classDateDetails.open)}
                                setValue={(callback) => handleChange("classDate", "classDate", callback(classDateDetails.classDate))}
                                setItems={(callback) => handleChange("classDate", "items", callback(classDateDetails.items))}
                                style={styles.dropdown}
                                dropDownContainerStyle={styles.dropdownContainer}
                            />
                        </View>

                        <AppText>Start Time:</AppText>
                        <TimePicker time={startTime} onTimeChange={setStartTime} />

                        <AppText>End Time:</AppText>
                        <TimePicker time={endTime} onTimeChange={setEndTime} />

                        <TextInput
                            style={styles.input}
                            label="Tution Master"
                            value={teacher}
                            onChangeText={setTeacher}
                        />

                        <MapView
                            style={styles.map}
                            initialRegion={region}
                            onLongPress={handleLongPress}
                            showsUserLocation={true}
                        >
                            {selectedLocation && (
                                <Marker coordinate={selectedLocation}>
                                    <Image
                                        source={require('./../../assets/images/mapmark.png')}
                                        style={{ width: 40, height: 40 }}
                                        resizeMode="contain"
                                    />
                                </Marker>
                            )}
                        </MapView>

                        <View style={styles.buttonContainer}>
                            <Button mode="contained" onPress={handleSave} style={styles.buttonStyle}>
                                {classDetails ? "Update Class" : "Add Class"}
                            </Button>
                        </View>
                    </>
                }
            />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 10,
    },
    input: {
        height: 50,
        borderColor: 'transparent',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
    pickerContainer1: {
        marginBottom: 10,
        zIndex: 1000,
    },
    pickerContainer2: {
        marginBottom: 10,
        zIndex: 900,
    },
    pickerContainer3: {
        marginBottom: 10,
        zIndex: 800,
    },
    dropdown: {
        backgroundColor: 'white',
        borderWidth: 0,
        borderBottomWidth: 0.3,
        borderBottomColor: 'gray',
        borderRadius: 0,
    },
    dropdownContainer: {
        backgroundColor: 'white',
        borderColor: 'gray',
        borderTopWidth: 0,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 20,
    },
    buttonStyle: {
        height: 50,
        justifyContent: 'center',
    },
    textInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        margin: 10,
        borderRadius: 5,
    },
    map: {
        flex: 1,
        width: '100%',
        height: 300,
    },
});


export default AddClass;
