import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StatusBar, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, ActivityIndicator, Keyboard, Alert, Image } from 'react-native';
import { TextInput, Button, Menu, Provider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { DB } from '../../utils/DBConnect';
import { collection, addDoc } from 'firebase/firestore';
import LottieView from 'lottie-react-native';

const sessionExpiryTime = 24 * 60 * 60 * 1000;

const AddTeachers = () => {
	const navigation = useNavigation();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [dropdownVisible, setDropdownVisible] = useState(false);
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [rePasswordVisible, setRePasswordVisible] = useState(false);

	const [loading, setLoading] = useState(false);
	const [showAnimation, setShowAnimation] = useState(false);

	// State to manage form data
	const [teacherDetails, setTeacherDetails] = useState({
		name: '',
		subject: '',
		contact: '',
		email: '',
		username: '',
		password: '',
		Re_Password: '',

	});

	const [imageUri, setImageUri] = useState(null);
	const [menuVisible, setMenuVisible] = useState(false);
	const streams = ['Maths', 'Bio', 'Physics', 'chemistry', 'ICT', 'Commerce'];
	const [errors, setErrors] = useState({});

	const handleBackPress = () => {
		navigation.goBack();
	};

	const handleImagePress = async () => {
		const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (!permissionResult.granted) {
			Alert.alert("Permission to access camera roll is required!");
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (!result.canceled) {
			setImageUri(result.assets[0].uri);  // Set the selected image URI
		}
	};


	// Validate the session
	useEffect(() => {
		const validateSession = async () => {
			const session = await AsyncStorage.getItem('userSession');
			if (session) {
				const { timestamp } = JSON.parse(session);
				const currentTime = new Date().getTime();

				if (currentTime - timestamp <= sessionExpiryTime) {
					setIsAuthenticated(true);
				} else {
					await AsyncStorage.removeItem('userSession');
					navigation.navigate('LoginScreen');
				}
			} else {
				navigation.navigate('LoginScreen');
			}
			setLoading(false);
		};

		validateSession();
	}, []);

	const handleChange = (field, value) => {
		setTeacherDetails((prevDetails) => ({
			...prevDetails,
			[field]: value,
		}));
	};

	const validateForm = () => {
		const newErrors = {};
		if (!teacherDetails.name) newErrors.name = 'Name is required.';
		if (!teacherDetails.subject) newErrors.subject = 'Subject is required.';
		if (!teacherDetails.contact) newErrors.contact = 'Contact is required.';
		if (!teacherDetails.email) newErrors.email = 'Email is required.';
		if (!teacherDetails.username) newErrors.username = 'Username is required.';
		if (!teacherDetails.password) newErrors.password = 'Password is required.';
		if (teacherDetails.password !== teacherDetails.Re_Password) {
			newErrors.Re_Password = 'Passwords do not match.';
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const resetForm = () => {
		setTeacherDetails({
			name: '',
			subject: '',
			contact: '',
			email: '',
			username: '',
			password: '',
			Re_Password: '',
		});
		setImageUri(null);
	};


	const handleAddTeachers = async () => {
		if (!validateForm()) return; // Validate the form

		try {
			setLoading(true);

			await addDoc(collection(DB, 'Teacher'), {
				name: teacherDetails.name,
				subject: teacherDetails.subject,
				contact: teacherDetails.contact,
				email: teacherDetails.email,
				username: teacherDetails.username,
				password: teacherDetails.password,
				imageUri: imageUri, // Optionally include the image URI
			});

			resetForm(); // Reset form after submission
			setShowAnimation(true);

			setTimeout(() => {
				setShowAnimation(false);
				navigation.goBack(); // Navigate back after adding the teacher
			}, 3000);
		} catch (error) {
			console.error('Error adding teacher: ', error);
			Alert.alert('Error', 'Could not add teacher. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const openMenu = () => setMenuVisible(true);
	const closeMenu = () => setMenuVisible(false);

	const handleStreamSelection = (subject) => {
		handleChange('subject', subject);
		closeMenu();
	};



	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<KeyboardAvoidingView
				style={{ flex: 1, backgroundColor: 'white' }}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			>
				<Provider>
					<View style={styles.container}>
						<StatusBar barStyle="light-content" backgroundColor="#7781FB" />

						<View style={styles.header}>
							<Text style={styles.headerTitle}>Add Teacher</Text>
							<TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
								<AntDesign name="arrowleft" size={24} color="#fff" />
							</TouchableOpacity>
						</View>
						<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
							<View style={styles.formContainer}>
								<TextInput
									label="Teacher Name"
									value={teacherDetails.name}
									onChangeText={(text) => handleChange('name', text)}
									style={styles.input}
									mode="outlined"
								/>
								{errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
								{/* Image picker button */}
								<TouchableOpacity style={styles.imageButton} onPress={handleImagePress}>
									<Text style={styles.imageButtonText}>Add Image</Text>
								</TouchableOpacity>

								{/* Display selected image */}
								{imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

								<Menu
									visible={menuVisible}
									onDismiss={closeMenu}
									anchor={
										<TouchableOpacity style={styles.dropdownButton} onPress={openMenu}>
											<Text style={styles.dropdownText}>
												{teacherDetails.subject || 'Select A/L Stream'}
											</Text>
										</TouchableOpacity>
									}
								>
									{streams.map((subject) => (
										<Menu.Item key={subject} onPress={() => handleStreamSelection(subject)} title={subject} />
									))}
								</Menu>

								<TextInput
									label="contact"
									value={teacherDetails.contact}
									onChangeText={(text) => handleChange('contact', text)}
									style={styles.input}
									mode="outlined"
								/>
								{errors.contact && <Text style={styles.errorText}>{errors.contact}</Text>}

								<TextInput
									label="email"
									value={teacherDetails.email}
									onChangeText={(text) => handleChange('email', text)}
									style={styles.input}
									mode="outlined"
								/>
								{errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

								<TextInput
									label="username"
									value={teacherDetails.username}
									onChangeText={(text) => handleChange('username', text)}
									style={styles.input}
									mode="outlined"
								/>
								{errors.username && <Text style={styles.errorText}>{errors.username}</Text>}


								<TextInput
									label="password"
									value={teacherDetails.password}
									onChangeText={(text) => handleChange('password', text)}
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
								{errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
								<TextInput
									label="Re-password"
									value={teacherDetails.Re_Password}
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

								<Button mode="contained" onPress={handleAddTeachers} style={styles.button} disabled={loading}>
									{loading ? <ActivityIndicator size="small" color="#fff" /> : 'Add Teacher'}
								</Button>
							</View>
						</ScrollView>
					</View>
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
				</Provider>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	header: {
		backgroundColor: '#7781FB',
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
		height: 60,
		justifyContent: 'center',
		alignItems: 'center',
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
		padding: 20,
	},
	input: {

		width: '100%',
	},
	errorText: {
		color: 'red',
		marginBottom: 10,
	},
	dropdownButton: {
		marginTop: 20,
		marginBottom: 10,
		padding: 10,
		borderWidth: 1,
		borderColor: 'gray',
		borderRadius: 5,
		height: 50,
	},
	dropdownText: {
		color: '#000',
		fontSize: 16,
	},
	button: {
		marginTop: 20,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	imageButton: {
		marginTop: 10,
		padding: 10,
		backgroundColor: '#7781FB',
		alignItems: 'center',
		borderRadius: 5,
	},
	imageButtonText: {
		color: '#fff',
		fontSize: 16,
	},
	imagePreview: {
		width: 100,
		height: 100,
		marginTop: 10,
		borderRadius: 10,
	},
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

});

export default AddTeachers;
