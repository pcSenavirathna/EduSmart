import React, { useEffect, useState } from 'react';
import {FlatList, View, Image, StyleSheet, ScrollView, Modal, Alert  } from 'react-native';
import { collection, getDocs, doc, deleteDoc, getFirestore} from 'firebase/firestore';
import { DB } from '../../utils/DBConnect';
import TopAppBar from './TopAppBar';
import { Button, TextInput, Text} from 'react-native-paper';
import { useNavigation} from 'expo-router';


const ViewClasses = () => {
    const navigation = useNavigation();
    const [classes, setClasses] = useState([]);
    const [searchQueryBatch, setSearchQueryBatch] = useState('');
    const [searchQueryInstitute, setSearchQueryInstitute] = useState('');
    const [filteredClasses, setFilteredClasses] = useState([]);
    const colors = ['red', 'blue', 'green', 'pink', 'yellow', 'teal'];

    //HANDLE READ
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const classCollection = collection(DB, 'class');
                const classSnapshot = await getDocs(classCollection);
                const classList = classSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setClasses(classList);
            } catch (err) {
                console.error('Error fetching classes:', err);
            }
        };

        fetchClasses();
    }, []);

    //Filter classes based on Institute
    useEffect(() => {
        if (searchQueryInstitute === '') {
            setFilteredClasses(classes); 
        } else {
            const filtered = classes.filter(item =>
                item.instituteName.toLowerCase().includes(searchQueryInstitute.toLowerCase())
            );
            setFilteredClasses(filtered);
        }
    }, [searchQueryInstitute, classes]);

    //Filter classes based on Batch
    useEffect(() => {
        if (searchQueryBatch === '') {
            setFilteredClasses(classes); 
        } else {
            const filtered = classes.filter(item =>
                item.batch === Number(searchQueryBatch)
            );
            setFilteredClasses(filtered);
        }
    }, [searchQueryBatch, classes]);

    //UPDATE
    const handleEditClass = () => {
        navigation.navigate('UpdateClass');
    };


    //DELETE
    const handleDelete = async (id) => {
        try {
            const classDoc = doc(DB, 'class', id); 
            await deleteDoc(classDoc);
            setClasses(classes.filter(item => item.id !== id)); 
        } catch (error) {
            console.error('Error deleting class:', error); 
        }
    };
    


    return (
        <ScrollView style={styles.bgColor}>
            <TopAppBar 
                title="Your Classes" 
                onBackPress={() => navigation.goBack()}
            />
            <View style={styles.container}>
                <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#7781FB',
                }}>Your classes</Text>

                <View style={styles.row}>
                    <TextInput
                        style={styles.searchBar}
                        placeholder='🔍 Search by Institute'
                        value={searchQueryInstitute}
                        onChangeText={text => setSearchQueryInstitute(text)} 
                    />
                    <TextInput
                        style={styles.searchBar}
                        placeholder='🔍 Search by Batch'
                        value={searchQueryBatch}
                        onChangeText={text => setSearchQueryBatch(text)}  
                    />
                </View>
            
                <FlatList
                    data={filteredClasses}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <View style={styles.classItem}>
                            <View style={styles.row}>
                                <Text style={{
                                    fontSize: 19,
                                    fontWeight: 'bold',
                                    color: colors[index % colors.length]
                                }}>#</Text>
                                <Text style={{
                                    fontSize: 19,
                                    marginLeft: 5
                                }}>{item.className}</Text>

                                <View style={styles.imageButtonEdt}>
                                    <Button onPress={() => handleEditClass()}  >
                                        <Image
                                            source={require("../../assets/images/SearchLesson/edit.png")}
                                            style={styles.editImg}
                                        />
                                    </Button> 
                                </View>
                                <View style={styles.imageButtonDel}>
                                    <Button onPress={() => handleDelete(item.id)} >
                                        <Image
                                            source={require("../../assets/images/SearchLesson/delete.png")}
                                            style={styles.deleteImg}
                                        />
                                    </Button> 
                                </View>
                                                   
                            </View>

                            

                            <Text style={{
                                fontWeight: 'bold',
                            }}>{item.subject}</Text>

                            <View style={{
                                flexDirection: 'row',
                                marginTop: 30
                            }}>
                                <Image
                                    source={require("../../assets/images/SearchLesson/book.png")}
                                    style={{
                                        marginRight: 5,
                                        marginTop: 6,
                                        width: 20,
                                        height: 20
                                    }}
                                ></Image>
                                <View>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                    }}>Ongoing Lesson</Text>
                                    <Text style={styles.lessonText}>{item.currentLesson}</Text>
                                </View>
                            </View>

                            <Text style={{
                                marginTop: 40,
                                fontSize: 12,
                                marginBottom: 5,
                                color: '#9b9b9e'
                            }}>Your Institute</Text>
                            <View style={{
                                flexDirection: 'row',
                                marginBottom: 5,
                            }}>
                                <Image 
                                    source={require("../../assets/images/SearchLesson/building.png")}
                                    style={styles.image1}
                                ></Image>
                                <Text style={{marginTop: 1}} >{item.instituteName}</Text>
                            </View>

                            <View style={styles.row2}>
                                <Text style={{
                                    fontSize: 12,
                                    marginTop: 12,
                                    alignSelf: 'flex-end'
                                }}>Batch<Text style={{ fontSize: 18 }}> {item.batch}</Text></Text>
                            </View>       

                        </View>
                    )}
                />
            </View>
        </ScrollView>
    );
    
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
        borderColor: '#404bc9',
        borderWidth: 2,
        borderRadius: 20,
        margin: 4,
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
        borderWidth: 1,
        marginTop: 5,
        marginRight: 5
    }
});



export default ViewClasses;

{/* <Button onPress={() => handleDelete(item.id)} >
                                        <Image
                                            source={require("../../assets/images/SearchLesson/delete.png")}
                                            style={styles.deleteImg}
                                        />
                                    </Button>  */}

    //                                     //DELETE
    // const handleDelete = async (id) => {
    //     try {
    //         const classDoc = doc(DB, 'class', id); 
    //         await deleteDoc(classDoc);
    //         setClasses(classes.filter(item => item.id !== id)); 
    //     } catch (error) {
    //         console.error('Error deleting class:', error); 
    //     }
    // };