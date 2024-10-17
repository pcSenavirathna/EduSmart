import React, { useState, useEffect } from 'react';
import { DB } from '../../utils/DBConnect';
import { useNavigation } from 'expo-router';
import { addDoc,collection, getDoc, getDocs } from 'firebase/firestore';
import { Button, TextInput, Text} from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { View, StyleSheet, ScrollView, Image, FlatList} from 'react-native';
import TopAppBar from './TopAppBar';
import { useRoute } from '@react-navigation/native';

const Dashboard = () => {


    const navigation = useNavigation();
    const [classCount, setClassCount] = useState(0); 
    const [classes, setClasses] = useState([]);
    const route = useRoute();
    const { username } = route.params;

    //fetch all classes
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


    //Count number of docs in the database
    const countClasses = async () => {
        try {
            const classCollection = collection(DB, 'class');
            const classSnapshot = await getDocs(classCollection);
            return classSnapshot.size; 
        } catch (err) {
            console.error('Error counting classes:', err);
            return 0; 
        }
    };


    useEffect(() => {
        const getClassCount = async () => {
            const count = await countClasses();
            setClassCount(count); 
        };

        getClassCount();
    }, []);


    return(
        <ScrollView style={styles.bgColor}>
            <TopAppBar 
                title="EduSmart" 
                onBackPress={() => navigation.goBack()} 
            />
            <View style={styles.container1}>
                <Text style={{
                    fontSize: 13,
                    color: '#96948d',
                    textAlign: 'right'
                }}>👋🥰Hi </Text>
                
                <Text style={{
                    fontSize: 14,
                    color: 'black',
                    textAlign: 'right'
                }}>{username}!</Text>

                <View style={styles.rowNew}>
                    <Image 
                        source={require('../../assets/images/SearchLesson/dashboard.png')}
                        style={styles.image2}
                    ></Image>
                    <Text style={{
                        fontSize: 17,
                        fontWeight: 700,
                        color: '#7781FB',
                        marginLeft: 4,
                        marginTop: 5
                    }}>Your Dashboard</Text>
                </View>

                <View style={styles.row}>
                    <View style={styles.rectangle}>
                        <Text style={{
                            fontSize: 13,
                            color: '#3d3d3a',
                        }}>Your Classes</Text>
                        <Text style={{
                            marginTop: 10,
                            fontSize: 27,
                            color: 'white',
                        }}>{classCount}</Text>
                        <Text style={{
                            fontSize: 11,
                            marginTop:10,
                            color: '#61615e'
                        }}>Total number of classes</Text>
                    </View>

                    <View style={styles.rectangle}>
                        <Text style={{
                            fontSize: 13,
                            color: '#3d3d3a',
                        }}>Ratings</Text>
                        <Text style={{
                            marginTop: 10,
                            fontSize: 27,
                            color: 'white',
                        }}>12</Text>
                        <Text style={{
                            fontSize: 11,
                            marginTop:10,
                            color: '#61615e'
                        }}>Total number of reviews for your classes</Text>
                    </View>
                </View>
                <View style={styles.rowNew}>
                    <Image
                        source={require('../../assets/images/SearchLesson/desk.png')}
                        style={styles.image2}
                    ></Image>
                    <Text style={{
                        marginTop: 10, 
                        marginLeft: 10,
                        marginBottom: 5,
                    }}>Your Recent Classes</Text>
                </View>

                <View style={styles.rowNew}>
                    <FlatList
                        data={classes}
                        keyExtractor={(item) => item.id}
                        numColumns={2} // This will make the items appear in 2 columns
                        renderItem={({ item, index }) => (
                            <View style={styles.classItem} >
                                <View style={styles.rectangle2}>
                                    <Text style={styles.cardText}>{item.className}</Text>
                                    <Text style={{ fontSize: 12, alignSelf: 'center' }}>{item.batch}</Text>
                                </View>
                            </View>
                        )}
                    />
                </View>

                <View style={styles.rowNew}>
                    <Image
                        source={require('../../assets/images/SearchLesson/student.png')}
                        style={styles.image2}
                    ></Image>
                    <Text style={{
                        marginTop: 10, 
                        marginLeft: 10
                    }}>Students</Text>
                </View>

                <View style={styles.row}>
                    <View style={styles.card}>
                        <Text style={{
                            fontSize: 30
                        }}>8</Text>
                        <Text style={{
                            fontSize: 13
                        }}>Students</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={{
                            fontSize: 30
                        }}>{classCount}</Text>
                        <Text style={{
                            fontSize: 13
                        }}>Classes</Text>
                    </View>
                    <View >
                        <Button 
                            onPress={() => navigation.navigate('AddClass')}
                            mode= 'contained'
                            style = {styles.addClassBtn}
                        >Add Class</Button>
                    </View>
                </View>
                <View>
                    <View >
                        <Button 
                            onPress={() => navigation.navigate('ViewStudents')}
                            mode= 'contained'
                            style = {styles.btn}
                        >View your students</Button>
                    </View>
                </View>
               
                
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container1: {
        flex: 1,
        padding: 20,
    },
    container2: {
        flex: 1,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 15
    },
    rectangle: {
        height: 120, 
        width: 120,
        backgroundColor: '#a2a9fa',
        borderRadius: 15, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        justifyContent: 'space-between',
        shadowRadius: 6,
        flex: 1, 
        marginHorizontal: 5,
        elevation: 8,
        borderWidth: 2, 
        borderColor: '#a2a9fa', 
        justifyContent: 'center', 
        alignItems: 'center', 
        alignSelf: 'center',
        marginBottom: 10,
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
    cardText:{
        fontSize: 16,
        textAlign: 'center',
        padding: 10,
        color: '#61615e'
    },
    emoji: {
        fontSize: 24,
    },
    card:{
        borderColor: '#404bc9',
        borderWidth: 2,
        borderRadius: 10,
        paddingVertical: 20,
        margin: 2,
        alignItems: 'center',
        flex: 1, 
        height: 'auto'
    },
    card2:{
        borderColor: '#a2a9fa',
        borderWidth: 2,
        borderRadius: 10,
        padding: 30,
        flex: 1,
        margin: 2,
        alignItems: 'center',
        backgroundColor: '#a2a9fa',
    },
    card3:{
        borderColor: '#a2a9fa',
        borderWidth: 2,
        borderRadius: 10,
        padding: 6,
        flex: 1,
        margin: 2,
        alignItems: 'center',
        backgroundColor: '#a2a9fa',
    },
    btn:{
        borderColor: '#7781FB',
        borderWidth: 2,
        borderRadius: 10,
        padding: 6,
        flex: 1,
        margin: 2,
        alignItems: 'center',
        backgroundColor: '#7781FB',
    },
    addClassBtn:{
        borderColor: '#7781FB',
        borderWidth: 2,
        borderRadius: 10,
        padding: 6,
        flex: 1,
        margin: 2,
        alignItems: 'center',
        backgroundColor: '#7781FB',
        justifyContent: 'center'
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
    image2:{
        height: 25,
        width: 25,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    rowNew: {
        flexDirection: 'row',
        marginTop: 5,
    },
    rectangle2:{
        height: 200, 
        width:150,
        padding: 10,
        // backgroundColor: '#7781FB',
        borderRadius: 15, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        justifyContent: 'space-between',
        shadowRadius: 6,
        flex: 1, 
        marginHorizontal: 5,
        elevation: 8,
        borderWidth: 5, 
        borderColor: '#a2a9fa', 
        justifyContent: 'center', 
        alignItems: 'center', 
        alignSelf: 'center',
        marginBottom: 10,
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

export default Dashboard;

