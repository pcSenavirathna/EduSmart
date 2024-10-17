import React, { useState } from 'react';
import { useNavigation } from 'expo-router';
import { AppText } from './../../components/AppText';
import { AppView } from './../../components/AppView';
import { View, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { DB } from '../../utils/DBConnect';
import { useUser } from '../../hooks/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
    const { setUser } = useUser();
    const navigation = useNavigation();

    const [loginDetails, setLoginDetails] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => {
        setLoginDetails((prevDetails) => ({
            ...prevDetails,
            [field]: value,
        }));
    };

    const handleLogin = async () => {
        const { email, password } = loginDetails;

        if (!email || !password) {
            Alert.alert('Error', "Please enter both email and password.");
            return;
        }

        setLoading(true);

        try {
            // Query Firestore for users table
            const userRef = collection(DB, "user");
            const qUser = query(
                userRef,
                where("email", "==", email),
                where("password", "==", password)
            );

            const userSnapshot = await getDocs(qUser);

            if (!userSnapshot.empty) {
                const userData = userSnapshot.docs[0].data();
                setUser(userData);
                await AsyncStorage.setItem('userSession', JSON.stringify(userData));
                navigation.navigate("Home");
                return;
            }

            // Query Firestore for managers table
            const managerRef = collection(DB, "managers");
            const qManager = query(
                managerRef,
                where("Email_Address", "==", email),
                where("Password", "==", password)
            );

            const managerSnapshot = await getDocs(qManager);

            if (!managerSnapshot.empty) {
                const managerData = managerSnapshot.docs[0].data();
                const session = {
                    email: managerData.Email_Address,
                    timestamp: new Date().getTime(),
                };
                await AsyncStorage.setItem('userSession', JSON.stringify(session));
                navigation.navigate('ManagerDashboard');
            } else {
                Alert.alert("Login Failed", "Invalid email or password.");
            }
        } catch (error) {
            console.error("Error during login: ", error);
            Alert.alert("Error", "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.scrollView}>
            <LinearGradient
                colors={[Colors.light.primary, Colors.light.accent]}
                style={styles.header}
            >
                <Ionicons name="school-outline" size={60} color="white" />
                <AppText style={styles.headerText}>Welcome to EduSmart</AppText>
            </LinearGradient>
            <AppView style={styles.container}>
                <View style={styles.formSection}>
                    <AppText style={styles.sectionTitle}>Login</AppText>
                    <TextInput
                        style={styles.input}
                        label="Email"
                        value={loginDetails.email}
                        onChangeText={text => handleChange('email', text)}
                        keyboardType="email-address"
                        left={<TextInput.Icon icon="email" />}
                    />
                    <TextInput
                        style={styles.input}
                        label="Password"
                        value={loginDetails.password}
                        onChangeText={text => handleChange('password', text)}
                        secureTextEntry
                        left={<TextInput.Icon icon="lock" />}
                    />
                </View>

                <Button mode="contained" onPress={handleLogin} style={styles.button}>
                    Login
                </Button>
                <TouchableOpacity onPress={() => navigation.navigate('StudentRegister')} style={styles.registerLink}>
                    <AppText style={styles.registerText}>Don't have an account? Register</AppText>
                </TouchableOpacity>
            </AppView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        height: height * 0.35,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        
        marginBottom: height * 0.05,
    },
    titleContainer: {
        width: '100%',
        alignItems: 'left',
    },
    headerText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 15,
        textAlign: 'center',
    },
    container: {
        flex: 1,
        padding: 30,
    },
    formSection: {
        marginBottom: 50,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.primary,
        marginTop: 30,
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        marginBottom: 15,
        backgroundColor: 'white',
    },
    button: {
        marginTop: 50,
        paddingVertical: 8,
        backgroundColor: Colors.light.primary,
    },
    registerLink: {
        marginTop: 15,
        alignItems: 'center',
    },
    registerText: {
        color: Colors.light.primary,
        fontSize: 16,
    },
});