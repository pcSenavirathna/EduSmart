import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { FlatList, View, Text, TextInput, Image, StyleSheet, ScrollView } from 'react-native';
import { collection, doc, getDocs, getDoc } from 'firebase/firestore';
import { DB } from '../../utils/DBConnect';
import TopAppBar from './TopAppBar';
import { Button } from 'react-native-paper';

const ClassDetails = ({ route }) => {

    const navigation = useNavigation();
    const { classId: passedClassId } = route.params;
    const [classId, setClassId] = useState(passedClassId || null);
    const [classDetails, setClassDetails] = useState(null);


    // useEffect(() => {
    //     const fetchClassDetails = async () => {
    //         try {
    //             const docRef = doc(DB, 'class', classId); // Fetch document by ID
    //             const docSnap = await getDoc(docRef);

    //             if (docSnap.exists()) {
    //                 setClassDetails(docSnap.data());
    //             } else {
    //                 console.log('No such document!');
    //             }
    //         } catch (error) {
    //             console.error('Error fetching class details:', error);
    //         }
    //     };

    //     fetchClassDetails(); // Fetch class details when the component mounts
    // }, [classId]);

    // if (!classDetails) {
    //     return <Text>Loading...</Text>;
    // }

    useEffect(() => {
        const fetchClassId = async () => {
            if (classId) return;

            try {
                const classCollection = collection(DB, 'class');
                const classSnapshot = await getDocs(classCollection);
                
                if (!classSnapshot.empty) {
                    const firstClassDoc = classSnapshot.docs[0]; // Fetch the first document
                    setClassId(firstClassDoc.id); // Set the auto-generated ID
                } else {
                    console.log('No classes found!');
                }
            } catch (error) {
                console.error('Error fetching class ID:', error);
            }
        };

        fetchClassId(); // Fetch the ID when the component mounts
    }, []);

    // Fetch class details using the auto-generated ID
    useEffect(() => {
        const fetchClassDetails = async () => {
            if (!classId) {
                console.log('No classId provided');
                return;
            }

            try {
                const docRef = doc(DB, 'class', classId); // Fetch document by auto-generated ID
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setClassDetails(docSnap.data());
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching class details:', error);
            }
        };

        fetchClassDetails(); // Fetch class details when classId is available
    }, [classId]);

    if (!classDetails) {
        return (
            <View style={styles.loadingContainer}>
                <Image
                    source={require("../../assets/images/SearchLesson/loading.png")}
                    style={styles.loadingImg}
                ></Image>
                 <Text style={styles.loading}>Loading...</Text>
            </View>
        );
    }


    return(
        <ScrollView >
             <TopAppBar 
                title="Class Details" 
                onBackPress={() => navigation.goBack()} 
            />
            <View style={styles.container1}>
                <Text style={{
                    fontSize: 15,
                    textAlign: 'center',
                    color: '#adaca8'
                }}>{classDetails.alStream}</Text>

                <Text style={{
                    fontSize: 17,
                    textAlign: 'center',
                }}>{classDetails.subject}</Text>
                {/*
                <Image
                    source={require("../../assets/images/SearchLesson/book.png")}
                    style= {styles.image}
                ></Image> */}

                <View style={{alignItems: 'center'}}>
                    <Text style={{
                        color: '#adaca8',
                        marginBottom: 5
                    }}>Class Code: {classDetails.classId}</Text>

                    <Text style={{
                        fontSize: 20,
                        color: '#7781FB',
                        marginBottom: 10
                    }}>{classDetails.className}</Text>


                    <Text style={{
                        fontSize: 19,
                        marginBottom: 5
                    }}>Teacher ID: {classDetails.teacherId}</Text>

                    <Text style={{
                        fontSize: 16,
                        color: '#403f3f',
                    }}>Institute: {classDetails.instituteName}</Text>
                </View>

                <View style={styles.container1}>
                    <Text style={styles.subTitle}>Batch: <Text style={styles.subContent}>{classDetails.batch}</Text></Text>

                    <Text style={styles.subTitle}>Location: <Text style={{ fontWeight: 'lighter' }}>{classDetails.institute}</Text></Text>

                    <Text style={{fontSize: 16, marginBottom: 5 }}>Current Lesson </Text>

                    {/* Rectangle */}
                    <View style={styles.rectangle}>
                        <Image
                            source={require("../../assets/images/SearchLesson/edit.png")}
                            style={{
                                height: 25,
                                width: 25,
                                marginBottom: 10
                            }}
                        ></Image>
                        <Text style={{
                            fontSize: 20,
                            textAlign: 'center',
                            color: 'white'
                        }}>{classDetails.currentLesson}</Text>
                    </View>

                    <View>
                        <Text style={styles.subTitle}>Teacher Details</Text>
                        <View style={styles.card}>
                            <Text>Name</Text>
                        </View>
                    </View>

                    <View style={{
                        alignSelf: 'center',
                        marginTop: 10
                    }}>
                        <Text style={{
                            color: '#403f3f',
                            marginBottom: 10,
                            alignSelf: 'center'
                        }}>Want to join class and Review?</Text>

                        <View style={styles.row}>
                            <Button mode='contained' style={{
                                backgroundColor: '#7781FB',
                                marginHorizontal: 5
                            }}>Join class</Button>

                            <Button
                                mode='contained'
                                onPress={() => navigation.navigate('UserFeedback', {
                                    classId: classDetails.classId, // Passing classId as a parameter
                                    className: classDetails.className, // You can pass more details if needed
                                    teacherId: classDetails.teacherId, // Example of additional parameter
                                    subject: classDetails.subject,
                                    instituteName: classDetails.instituteName,
                                    currentLesson: classDetails.currentLesson,

                                })}
                                style={{
                                    backgroundColor: '#7781FB',
                                    marginHorizontal: 5
                                }}
                            >
                                Review
                            </Button>


                            <Button mode='contained' onPress={() => navigation.goBack()} style={{
                                backgroundColor: '#A9A0AB',
                                marginHorizontal: 5
                            }}>Back</Button>
                        </View>
                    </View>
                </View>

            </View>
        </ScrollView>
    )
}


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
    rectangle: {
        width: 300, 
        height: 100,
        backgroundColor: '#7781FB',
        borderRadius: 15, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 4 }, 
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 8,
        borderWidth: 2, 
        borderColor: '#7781FB', 
        justifyContent: 'center', 
        alignItems: 'center', 
        alignSelf: 'center',
        marginBottom: 10
    },
    loadingContainer:{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    loadingImg:{
        height: 35,
        width: 35,
        alignSelf: 'center',
        marginBottom: 15
    },
    loading:{
        fontSize: 16,
        color: '#7781FB'
    },
    emoji: {
        fontSize: 24,
    },
    card:{
        borderColor: '#404bc9',
        borderWidth: 2,
        borderRadius: 20,
        padding: 8,
        paddingLeft: 20
    },
    icon:{
        marginRight: 10,
    },
    subTitle: {
        fontSize: 16,
        marginBottom: 10
    },
    subContent: {
        fontSize: 19, 
        fontWeight: 'bold',
        color: '#403f3f'
    },
    image: {
        height: 35,
        width: 35,
        alignSelf: 'center',
        marginTop: 30,
        marginBottom: 30,
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

export default ClassDetails;