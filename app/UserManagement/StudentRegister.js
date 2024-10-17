import React, { useState } from 'react';
import { useNavigation } from 'expo-router';
import { AppText } from '../../components/AppText';
import { AppView } from '../../components/AppView';
import { View, StyleSheet, Platform, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import DatePicker from '../../components/AppDatePicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { DB } from '../../utils/DBConnect';
import { UserTypes } from '../../constants/UserTypes';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

const StudentRegister = ({ }) => {
    const navigation = useNavigation();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(new Date());
    const [stream, setStream] = useState('Maths');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: 'Maths', value: 'Maths' },
        { label: 'Science', value: 'Science' },
        { label: 'Art', value: 'Art' },
        { label: 'Tech', value: 'Tech' },
    ]);

    const handleRegister = () => {

        const q = query(collection(DB, "user"), where("userType", "==", UserTypes.student));
        getDocs(q)
            .then((querySnapshot) => {
                const firstLetter = UserTypes.student.charAt(0).toUpperCase();
                const size = querySnapshot.empty ? 0 : querySnapshot.size;
                const paddedNumber = (size + 1).toString().padStart(4, '0');
                var studentId = `${firstLetter}${paddedNumber}`;
    
                var student = {
                    studentId: studentId,
                    firstName: firstName,
                    lastName: lastName,
                    dateOfBirth: dateOfBirth,
                    stream: stream,
                }
    
                addDoc(collection(DB, "user"), {
                    email: email,
                    password: password,
                    userType: UserTypes.student,
                    user: student
                })
                    .then(() => {
                        console.log('Data added');
                        navigation.navigate('Login');
                    })
                    .catch((error) => {
                        console.log(error);
                    });
    
            })
            .catch((error) => {
                console.log(error);
                throw error;
            });
    
    };

    const hadleManagerRegister = () => {
        navigation.navigate('ManagerRegister');
    };
    return (
        <ScrollView style={styles.scrollView}>
            <LinearGradient
                colors={[Colors.light.primary, Colors.light.accent]}
                style={styles.header}
            >
                <Ionicons name="school-outline" size={60} color="white" />
                <AppText style={styles.headerText}>Student Registration</AppText>
            </LinearGradient>
            <AppView style={styles.container}>
                <View style={styles.formSection}>
                    <AppText style={styles.sectionTitle}>Personal Information</AppText>
                    <TextInput
                        style={styles.input}
                        label="First Name"
                        value={firstName}
                        onChangeText={setFirstName}
                        left={<TextInput.Icon icon="account" />}
                    />
                    <TextInput
                        style={styles.input}
                        label="Last Name"
                        value={lastName}
                        onChangeText={setLastName}
                        left={<TextInput.Icon icon="account" />}
                    />
                    <View style={styles.datePickerContainer}>
                        <AppText style={styles.label}>Date Of Birth:</AppText>
                        <DatePicker date={dateOfBirth} onDateChange={setDateOfBirth} textColor={Colors.light.primary} />
                    </View>
                </View>

                <View style={styles.formSection}>
                    <AppText style={styles.sectionTitle}>Academic Information</AppText>
                    <View style={styles.pickerContainer}>
                        <AppText style={styles.label}>A/L Stream:</AppText>
                        <DropDownPicker
                            open={open}
                            value={stream}
                            items={items}
                            setOpen={setOpen}
                            setValue={setStream}
                            setItems={setItems}
                            style={styles.dropdown}
                            dropDownContainerStyle={styles.dropdownContainer}
                        />
                    </View>
                </View>

                <View style={styles.formSection}>
                    <AppText style={styles.sectionTitle}>Account Information</AppText>
                    <TextInput
                        style={styles.input}
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        left={<TextInput.Icon icon="email" />}
                    />
                    <TextInput
                        style={styles.input}
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        left={<TextInput.Icon icon="lock" />}
                    />
                </View>

                <Button mode="contained" onPress={handleRegister} style={styles.button}>
                    Register
                </Button>
                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
                    <AppText style={styles.loginText}>Already have an account? Login</AppText>
                </TouchableOpacity>
                <View style={{ marginTop: 10 }}>
                <Button onPress={hadleManagerRegister}>
                    Manager Register
                </Button>

            </View>
        </AppView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        height: height * 0.25,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 10,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    formSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.primary,
        marginBottom: 10,
    },
    input: {
        marginBottom: 15,
        backgroundColor: 'white',
    },
    datePickerContainer: {
        marginBottom: 15,
    },
    pickerContainer: {
        marginBottom: 15,
        zIndex: 1000,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: Colors.light.text,
    },
    dropdown: {
        backgroundColor: 'white',
        borderWidth: 0,
        borderBottomWidth: 0.5,
        borderBottomColor: 'gray',
    },
    dropdownContainer: {
        backgroundColor: 'white',
        borderColor: 'gray',
    },
    button: {
        marginTop: 20,
        paddingVertical: 8,
        backgroundColor: Colors.light.primary,
    },
    loginLink: {
        marginTop: 15,
        alignItems: 'center',
    },
    loginText: {
        color: Colors.light.primary,
        fontSize: 16,
    },
});

export default StudentRegister;

