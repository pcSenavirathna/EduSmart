import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { FlatList, View, Text, TextInput, Image, StyleSheet, ScrollView } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { DB } from '../../utils/DBConnect';
import TopAppBar from './TopAppBar';
import { Button } from 'react-native-paper';

const SearchLessons = () => {
    const navigation = useNavigation();
    const [classes, setClasses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
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

    //Filter classes based on search query
    useEffect(() => {
        if (searchQuery === '') {
            setFilteredClasses(classes); 
        } else {
            const filtered = classes.filter(item =>
                item.currentLesson.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredClasses(filtered);
        }
    }, [searchQuery, classes]);

    return (
        <ScrollView style={styles.bgColor}>
            <TopAppBar 
                title="Search classes by Ongoing Lesson" 
                onBackPress={() => navigation.goBack()}
            />
            <View style={styles.container}>
                <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#7781FB',
                    marginBottom: 5,
                }}>Search classes</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder='🔍 Search by Current Lesson'
                    value={searchQuery}
                    onChangeText={text => setSearchQuery(text)}  // Fix is here: use onChangeText
                />
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
                            </View>

                            <Text style={{
                                    fontSize: 13,
                                    color: '#656569',
                                }}>Teacher</Text>
                            <Text >{item.teacher}Hi</Text>


                            <Text style={{
                                fontWeight: 'bold',
                                marginTop: 12
                            }}>{item.subject}</Text>

                            <Text
                                style={{
                                    marginTop: 5,
                                    fontSize: 12

                            }}>Ongoing Lesson</Text>
                            <Text style={styles.lessonText}>{item.currentLesson}</Text>

                            <Image 
                                source={require("../../assets/images/SearchLesson/building.png")}
                                style={styles.image}
                            ></Image>
                            <Text style={styles.instituteText}>{item.instituteName}</Text>

                            <View>
                                <View>
                                    <Text style={{
                                        alignSelf: 'flex-end',
                                        position: 'absolute',
                                        bottom: 5, 
                                        left: 410,
                                        marginRight: 8,
                                        fontSize: 18
                                    }}><Text style={{ fontSize: 12 }}>Batch</Text>{item.batch}</Text>
                                </View>

                                <Button 
                                    style={styles.viewBtn} 
                                    mode="contained" 
                                    onPress={() => navigation.navigate('ClassDetails', { classId: item.id })}
                                >View Class</Button>
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
        bottom: 15, 
        left: 35
    },
    image:{
        resizeMode: 'contain',
        position: 'absolute',
        bottom: 16, 
    },
    emoji: {
        fontSize: 24,
    },
    viewBtn: {
        backgroundColor: '#7781FB',
        width: 150,
        alignSelf: 'flex-end',
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
    row: {
        flexDirection: 'row',
    },
    searchInput: {
        height: 40,
        borderColor: '#9b9b9e',
        color: '#9b9b9e',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 10,
        marginBottom: 20,
    }
});

export default SearchLessons;
