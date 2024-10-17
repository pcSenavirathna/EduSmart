import React, { useState, useCallback } from 'react';
import { Modal, View, Text, StatusBar, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { TextInput, Button } from 'react-native-paper';
import { DB } from '../../utils/DBConnect';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'; 
import LottieView from 'lottie-react-native';

const ManagerRegister = () => {
	const navigation = useNavigation();
	const [registerDetails, setRegisterDetails] = useState({
		Institute_name: '',
		city: '',
		Address: '',
		Email_Address: '',
		Username: '',
		Password: '',
		Re_Password: '',
	});

	const [errors, setErrors] = useState({});
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [rePasswordVisible, setRePasswordVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showAnimation, setShowAnimation] = useState(false);

	const handleChange = useCallback((field, value) => {
		setRegisterDetails((prevDetails) => ({
			...prevDetails,
			[field]: value,
		}));

		validateField(field, value);
	}, [registerDetails]);

	const handleBackPress = () => {
		console.log('Back button pressed');
		navigation.goBack();
	};

	const validateField = (field, value) => {
		let error = '';
		switch (field) {
			case 'Email_Address':
				const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailPattern.test(value)) error = 'Please enter a valid email address.';
				break;
			case 'Password':
				const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*#?&]{8,}$/;
				if (!passwordPattern.test(value)) {
					error = 'Password must contain at least 8 characters, including uppercase, lowercase, special character, and number.';
				}
				break;
			case 'Re_Password':
				if (value !== registerDetails.Password) error = 'Passwords do not match.';
				break;
			case 'Username':
				if (/\s/.test(value)) error = 'Username cannot contain spaces.';
				break;
			default:
				if (!value) error = `${field.replace('_', ' ')} is required.`;
		}
		setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
	};

	const handleRegister = async () => {
		const { Institute_name, city, Address, Email_Address, Username, Password, Re_Password } = registerDetails;

		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailPattern.test(Email_Address)) {
			Alert.alert('Error', 'Please enter a valid email address.');
			return;
		}

		// Validate required fields
		if (!Institute_name || !city || !Address || !Email_Address || !Username || !Password || !Re_Password) {
			Alert.alert('Error', 'Please fill in all required fields.');
			return;
		}

		let valid = true;
		Object.keys(registerDetails).forEach((field) => {
			if (validateField(field, registerDetails[field])) {
				valid = false;
			}
		});

		if (!valid) {
			Alert.alert('Error', 'Please fill in all required fields correctly.');
			return;
		}

		try {

			setLoading(true);

			const managerRef = collection(DB, "managers");

			const emailQuery = query(managerRef, where("Email_Address", "==", Email_Address));
			const emailQuerySnapshot = await getDocs(emailQuery);
			if (!emailQuerySnapshot.empty) {
				Alert.alert('Error', 'This Email address is already registered.');
				return;
			}

			const usernameQuery = query(managerRef, where("Username", "==", Username));
			const usernameSnapshot = await getDocs(usernameQuery);
			if (!usernameSnapshot.empty) {
				Alert.alert('Error', 'Username is already taken.');
				return;
			}

			const docRef = await addDoc(collection(DB, "managers"), {
				Institute_name: Institute_name,
				city: city,
				Address: Address,
				Email_Address: Email_Address,
				Username: Username,
				Password: Password,
				createdAt: new Date(),
			});

			setShowAnimation(true);

			setTimeout(() => {
				setShowAnimation(false);
				navigation.navigate('Login');
			}, 3000);
		} catch (error) {
			console.error("Error adding document: ", error);
			Alert.alert('Error', 'Failed to register. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<KeyboardAvoidingView
				style={{ flex: 1, backgroundColor: 'white' }}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
			>
				<StatusBar barStyle="light-content" backgroundColor="#7781FB" />
				<View style={styles.header}>
					<Text style={styles.headerTitle}>Manager Register</Text>
					<TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
						<AntDesign name="arrowleft" size={24} color="#fff" />
					</TouchableOpacity>
				</View>
				<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
					<View>
						<Text style={styles.title}>Register</Text>
					</View>
					<View >
						<View style={styles.formContainer}>
						<TextInput
							label="Institute Name"
							value={registerDetails.Institute_name}
							onChangeText={(text) => handleChange('Institute_name', text)}
							style={[styles.input, { borderRadius: 20 }]}
							mode="outlined"
						/>
							{errors.Institute_name && <Text style={styles.errorText}>{errors.Institute_name}</Text>}
						</View>
						<View style={styles.formContainer}>
						<TextInput
							label="City"
							value={registerDetails.city}
							onChangeText={(text) => handleChange('city', text)}
							style={styles.input}
							mode="outlined"
						/>
							{errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
						</View>
						<View style={styles.formContainer}>
						<TextInput
							label="Address"
							value={registerDetails.Address}
							onChangeText={(text) => handleChange('Address', text)}
							style={styles.input}
							mode="outlined"
						/>
							{errors.Address && <Text style={styles.errorText}>{errors.Address}</Text>}
						</View>
						<View style={styles.formContainer}>
						<TextInput
							label="Email Address"
							value={registerDetails.Email_Address}
							onChangeText={(text) => handleChange('Email_Address', text)}
							style={styles.input}
							mode="outlined"
						/>
							{errors.Email_Address && <Text style={styles.errorText}>{errors.Email_Address}</Text>}
						</View>
						<View style={styles.formContainer}>
						<TextInput
							label="Username"
							value={registerDetails.Username}
							onChangeText={(text) => handleChange('Username', text)}
							style={styles.input}
							mode="outlined"
						/>
							{errors.Username && <Text style={styles.errorText}>{errors.Username}</Text>}
						</View>
						<View style={styles.formContainer}>
						<TextInput
							label="Password"
							value={registerDetails.Password}
							onChangeText={(text) => handleChange('Password', text)}
							secureTextEntry={!passwordVisible}
							right={
								<TextInput.Icon
									icon={passwordVisible ? "eye" : "eye-off"}
									onPress={() => setPasswordVisible(!passwordVisible)}
								/>
							}
							style={styles.input}
							mode="outlined"
						/>
							{errors.Password && <Text style={styles.errorText}>{errors.Password}</Text>}
						</View>
						<View style={styles.formContainer}>
						<TextInput
							label="Re-Password"
							value={registerDetails.Re_Password}
							onChangeText={(text) => handleChange('Re_Password', text)}
							secureTextEntry={!rePasswordVisible}
							right={
								<TextInput.Icon
									icon={rePasswordVisible ? "eye" : "eye-off"}
									onPress={() => setRePasswordVisible(!rePasswordVisible)}
								/>
							}
							style={styles.input}
							mode="outlined"
						/>
							{errors.Re_Password && <Text style={styles.errorText}>{errors.Re_Password}</Text>}
						</View>
						<View style={styles.formContainer}>
							<Button mode="contained" onPress={handleRegister} disabled={loading} style={styles.button}>
								{loading ? <ActivityIndicator size="small" color="#fff" /> : 'Register'}
							</Button>
						</View>
					</View>
				</ScrollView>
				{showAnimation && (
					<Modal visible={showAnimation} transparent={true}>
						<View style={styles.animationContainer}>
							<LottieView
								source={require('../../assets/animations/done.json')} // Replace with your path
								autoPlay
								loop={false}
								style={styles.animation}
							/>
						</View>
					</Modal>
				)}
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	animationContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	animation: {
		width: 500,
		height: 500,
	},

	errorText: {
		color: 'red',
		alignSelf: 'flex-start',
		marginBottom: 10,
	},
	header: {
		backgroundColor: '#7781FB',
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
		height: 60,
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
		elevation: 5,
		flexDirection: 'row',
	},
	headerTitle: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 20,
		textAlign: 'center',
		flex: 1,
	},
	backButton: {
		left: 20,
		position: 'absolute',
	},
	formContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		paddingHorizontal: 20,
		marginBottom: 5,
	},
	title: {
		fontWeight: 'bold',
		marginBottom: 20,
		fontSize: 21,
		margin: 20,
	},
	input: {
		width: '100%',


	},
	button: {
		width: '100%',
		marginTop: 20,
	},
	animationContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	animation: {
		width: 400,
		height: 400,
	},
});

export default ManagerRegister;
