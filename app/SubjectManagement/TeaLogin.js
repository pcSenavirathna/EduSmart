import React, { useState, useEffect } from 'react';
import { DB } from '../../utils/DBConnect';
import { useNavigation } from 'expo-router';
import { addDoc,collection, getDoc, getDocs } from 'firebase/firestore';
import { Button, TextInput, Text} from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { View, StyleSheet, Image, FlatList} from 'react-native';

const TeaLogin = () => {

    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return(
        <View style={styles.container1}>
            <View style={styles.container3}>
                <Text style={{
                    fontSize: 30,
                    textAlign: 'center',
                    color: '#7781FB',
                    fontWeight: '700',
                    marginBottom: 10
                }}>EduSmart</Text>
                <Text style={{
                    fontSize: 20,
                    fontWeight: 700,
                    marginLeft: 20,
                    marginBottom: 40
                }}>Login</Text>
                <Image 
                    source={require('../../assets/images/icon.png')}
                    style={styles.image}
                ></Image>

                <TextInput
                    style={styles.input}
                    label="Username"
                    value={username}
                    onChangeText={text => setUsername(text)}
                />
                <TextInput
                    style={styles.input}
                    label="Password"
                    value={password}
                    secureTextEntry={true}  // Make password field secure
                    onChangeText={text => setPassword(text)} 
                />

                <View style={{marginTop: 50}}>
                    <Button 
                        onPress={() => {
                            navigation.navigate('Dashboard', { username }); // Pass username to Dashboard
                        }}
                        mode='contained'
                        style={styles.btn}
                    >Login</Button>
                </View>
                <View style={{marginTop: 15}}>
                    <Button 
                        onPress={() => {navigation.goBack()}}
                        mode= 'contained'
                        style={styles.backBtn}
                    >Back</Button>
                </View>

                <Text style={{
                    fontSize :14,
                    textAlign: 'center',
                    marginTop: 12
                }}>Do not have a account yet?<Text style={{
                    color: 'red'
                    }}> Contact Admin</Text></Text>
               
                
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container1: {
        flex: 1,
        backgroundColor:  'white'
    },
    container3: {
        flex: 1,
        marginHorizontal: 70,
        marginTop: 30,
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
        width: 150,
        height: 150,
        alignSelf: 'center',
        marginBottom: 10,
    },
    logoutImg:{
        width: 30,
        height: 30,
    },
    emoji: {
        fontSize: 24,
    },
    backBtn:{
        color: 'white',
        backgroundColor: '#A9A0AB'
    },
    titleText:{
        marginTop: 15,
        color: 'white'
    },
    input: {
        fontSize: 15,
        height: 50,
        borderColor: 'transparent',
        borderWidth: 1,
        padding: 10,
        marginBottom: 20,
        marginRight: 30,
        marginLeft: 30,
        fontFamily: 'Roboto',
        backgroundColor: 'white',
    },
    btn:{
        backgroundColor: '#7781FB',
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
    
});

export default TeaLogin;