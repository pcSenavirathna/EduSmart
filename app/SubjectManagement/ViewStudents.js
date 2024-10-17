import React, { useEffect, useState } from 'react';
import {FlatList, View, Image, StyleSheet, ScrollView, Modal, Alert  } from 'react-native';
import { collection, getDocs, doc, deleteDoc, getFirestore} from 'firebase/firestore';
import { DB } from '../../utils/DBConnect';
import TopAppBar from './TopAppBar';
import { Button, TextInput, Text} from 'react-native-paper';
import { useNavigation} from 'expo-router';

const ViewStudents = () => {
    const navigation = useNavigation();
    const [students, setStudents] = useState([]);
    const colors = ['red', 'blue', 'green', 'pink', 'yellow', 'teal'];
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);

    //HANDLE READ
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const studentCollection = collection(DB, 'Student');
                const studentSnapshot = await getDocs(studentCollection);
                const studentList = studentSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setStudents(studentList);
            } catch (err) {
                console.error('Error fetching Students:', err);
            }
        };

        fetchStudents();
    }, []);


    //Filter classes based on Batch
    useEffect(() => {
        if (searchQuery === '') {
            setFilteredStudents(students); 
        } else {
            const filtered = students.filter(item =>
                item.stream.toLowerCase().includes(searchQuery.toLowerCase())
                // item.firstName
            );
            setFilteredStudents(filtered);
        }
    }, [searchQuery, students]);

    return(
        <ScrollView style={styles.bgColor}>
            <TopAppBar 
                title="All students" 
                onBackPress={() => navigation.goBack()} 
            />
            <View style={styles.container}>
                <View style={styles.row}>
                    <Image
                        source={require('../../assets/images/SearchLesson/student.png')}
                        style={styles.image}
                    ></Image>
                    <Text style={{
                        fontSize :17,
                        fontWeight: 700,
                        marginTop :5,
                        color: '#7781FB'
                    }}>All Students of your classes</Text>
                </View>

                <TextInput
                    style={styles.searchBar}
                    placeholder='🔍 Search by student name'
                    value={searchQuery}
                    onChangeText={text => setSearchQuery(text)} 
                />

                <FlatList
                    data={students}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <View style={styles.studentItem}>
                            <View style={styles.card} >
                                <View style={styles.row} >
                                    <Text style={{
                                        fontSize: 14,
                                        marginTop: 2,
                                        color: colors[index % colors.length]
                                    }}>{index + 1}</Text>
                                    <View>
                                        <Text style={{
                                                fontSize: 16,
                                                marginLeft: 5
                                        }}>{item.name}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                />
            </View>
        </ScrollView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    bgColor: {
        backgroundColor: 'white',
    },
    input: {
        height: 50,
        borderColor: 'transparent',
        borderWidth: 1,
        marginBottom: 10,
        fontFamily: 'Roboto',
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
    imageButtonEdt: {
        position: 'absolute',
        right: 1,
        backgroundColor: 'transparent', 
    },
    imageButtonDel: {
        position: 'absolute',
        right: 1,
        backgroundColor: 'transparent', 
        marginTop: 40
    },
    image:{
        height: 25,
        width: 25,
    },
    classItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        borderWidth: 2,
        borderRadius: 20,
        borderColor: '#7781FB',
        backgroundColor: '#B4BAFF',
        position: 'relative'
    },
    instituteText: {
        position: 'absolute',
        bottom: 1,
        left: 35
    },
    image1:{
        marginRight:5,
    },
    emoji: {
        fontSize: 24,
    },
    viewBtn: {
        backgroundColor: '#7781FB',
        width: 150,
        alignSelf: 'flex-end',
    },
    editImg: {
        width: 24,
        height: 24,
    },
    deleteImg: {
        width: 24,
        height: 24,
    },
    card:{
        borderColor: '#a2a9fa',
        borderWidth: 2,
        borderRadius: 8,
        height: 40,
        padding: 8,
        marginBottom: 5,
        flex: 1
    },
    lessonText:{
        fontSize: 17,
        
    },
    searchRow: {
        flexDirection: 'row',
        marginBottom: 12,
        
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    row2:{
        flexDirection: 'row',
        marginBottom: 5,
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 1,
        left: 425
    },
    searchBar: {
        fontSize: 14,
        borderRadius: 40,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        borderWidth: 0,
        height: 40,
        flex: 1,
        borderColor: '#9b9b9e',
        color: '#9b9b9e',
        justifyContent: 'center',
        borderWidth: 1,
        marginTop: 5,
        marginRight: 10,
        marginBottom: 20,
        padding: 12
    }

});



export default ViewStudents;