import React, { useState } from 'react';
import { useNavigation } from 'expo-router';
import {  View, Text, TextInput, Image, StyleSheet,ActivityIndicator  } from 'react-native';
import { Button } from 'react-native-paper';


const Menu = () => {

    const navigation = useNavigation();
    const [loading, setLoading] = useState(false); 

    const handleLogout = () => {
        setLoading(true); 
        setTimeout(() => {
            setLoading(false); 
            navigation.navigate('TeaLogin'); 
        }, 2000); 
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#a2a9fa" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return(
        <View style={styles.bgColor}>
            <View style={styles.container1}>

                <View style={styles.row}>
                    <Button onPress={() => navigation.goBack()}>
                        <Image
                            source={require("../../assets/images/SearchLesson/backBtn.png")}
                            style={styles.logoutImg}
                        ></Image>
                    </Button>
                    <View>
                        <Text style={{
                            fontSize: 17,
                            color: 'white',
                        }}>Menu</Text>

                        <Text style={{
                            fontSize: 14,
                            color: '#ded7d7'
                        }}>
                        Pamali Sapunika</Text>
                    </View>
                </View>

                <View style={styles.container2}>
                    <View style={styles.centeredView}>
                        <View style={styles.circle}>
                            <Button onPress={() => navigation.navigate('AddClass')}>
                                <Image 
                                    source={require("../../assets/images/SearchLesson/class.png")}
                                    style = {styles.image}
                                ></Image>
                            </Button>
                        </View>
                        <Text style={styles.titleText}>Add Class</Text>
                    </View>
                    <View style={styles.centeredView}>
                        <View style={styles.circle}>
                            <Button onPress={() => navigation.navigate('Menu')}>
                                <Image 
                                    source={require("../../assets/images/SearchLesson/profile.png")}
                                    style = {styles.image}
                                ></Image>
                            </Button>
                        </View>
                        <Text style={styles.titleText}>Your Profile</Text>
                    </View>
                    <View style={styles.centeredView}>
                        <View style={styles.circle}>
                            <Button onPress={() => navigation.navigate('ViewClasses')}>
                                <Image 
                                    source={require("../../assets/images/SearchLesson/viewClass.png")}
                                    style = {styles.image}
                                ></Image>
                            </Button>
                        </View>
                        <Text style={styles.titleText}>View Classes</Text>
                    </View>
                </View>
                
                <View style={styles.container2}>
                    <View style={styles.centeredView}>
                        <View style={styles.circle}>
                            <Button onPress={() => navigation.navigate('Dashboard')}>
                                <Image 
                                    source={require("../../assets/images/SearchLesson/attendance.png")}
                                    style = {styles.image}
                                ></Image>
                            </Button>
                        </View>
                        <Text style={styles.titleText}>Mark Attendance</Text>
                    </View>
                    <View style={styles.centeredView}>
                        <View style={styles.circle}>
                            <Button onPress={() => navigation.navigate('ViewStudents')}>
                                <Image 
                                    source={require("../../assets/images/SearchLesson/students.png")}
                                    style = {styles.image}
                                ></Image>
                            </Button>
                        </View>
                        <Text style={styles.titleText}>View Students</Text>
                    </View>
                    <View style={styles.centeredView}>
                        <View style={styles.circle}>
                            <Button onPress={() => navigation.navigate('SearchLessons')}>
                                <Image 
                                    source={require("../../assets/images/SearchLesson/shelf.png")}
                                    style = {styles.image}
                                ></Image>
                            </Button>
                        </View>
                        <Text style={styles.titleText}>Search Classes</Text>
                    </View>
                </View>

                <View style={styles.container2}>
                    <View style={styles.logout}>
                        <Text style={{
                            marginBottom: 20,
                            color: 'white'
                        }}>Log out</Text>
                        <Button 
                            onPress={handleLogout}
                        >
                            <Image
                                source={require("../../assets/images/SearchLesson/logout.png")}
                                style= {styles.logoutImg}
                            ></Image>
                        </Button>
                    </View>
                </View>

            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container1: {
        flex: 1,
        padding: 10,
    },
    container2: {
        flex: 1,
        paddingTop: 40,
        paddingLeft: 50,
        paddingRight: 50,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    circle: {
        width: 100,               
        height: 100,               
        borderRadius: 50,         
        backgroundColor: 'white',  
        justifyContent: 'center',  
        alignItems: 'center', 
    },
    image:{
        width: 40,
        height: 40,
    },
    logoutImg:{
        width: 30,
        height: 30,
    },
    emoji: {
        fontSize: 24,
    },
    backBtn:{
        marginRight: 10,
        marginTop: 10,
        height: 10,
        width: 10,
        iconSize: 30,
        color: 'white',
    },
    titleText:{
        marginTop: 15,
        fontSize: 16,
        color: 'white'
    },
    centeredView:{
        justifyContent: 'center',
        alignItems: 'center', 
    },
    row: {
        flexDirection: 'row',

    },
    animation: {
        width: 300,
        height: 300,
    },
    bgColor: {
        backgroundColor: '#7781FB',
        flex: 1, 
    },
    logout: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        position: 'absolute',
        flexDirection: 'row',   
        bottom: 20,        
        right: 20,  
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#7781FB',
    },
    loadingText: {
        marginTop: 20,
        fontSize: 18,
        color: 'white',
    },
});

export default Menu;