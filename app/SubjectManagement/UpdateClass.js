import React, { useState, useEffect } from 'react';
import { DB } from '../../utils/DBConnect';
import { useNavigation, } from 'expo-router';
import { updateDoc , doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { Button} from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { FlatList, View, Text, TextInput, Image, StyleSheet, ScrollView, Alert} from 'react-native';
import TopAppBar from './TopAppBar';

const UpdateClass = () => {

    const navigation = useNavigation();

    return(
        <ScrollView>
            <TopAppBar 
                title="Update class" 
                onBackPress={() => navigation.goBack()} 
            />
            <View style={styles.container}>
                   
                <Text>Update</Text>

            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
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

export default UpdateClass;

