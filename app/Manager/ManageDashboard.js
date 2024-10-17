import { View, Text, ActivityIndicator, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
import { getFirestore, collection, getDocs } from "firebase/firestore";


const sessionExpiryTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const ManageDashboard = () => {

	const navigation = useNavigation();
	const [loading, setLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [dropdownVisible, setDropdownVisible] = useState(false);
	const [teacherCount, setTeacherCount] = useState(0);
	const [studentCount, setStudentCount] = useState(0);

	const handleBackPress = () => {
		navigation.goBack();
	};

	const handleImagePress = () => {
		setDropdownVisible(!dropdownVisible);
	};

	const handleLogout = async () => {
		await AsyncStorage.removeItem('userSession');
		navigation.navigate('Login');
	};

	const handleProfile = () => {
		navigation.goBack();
	};

	const fetchTeacherCount = async () => {
		const db = getFirestore();
		const querySnapshot = await getDocs(collection(db, "Teacher"));
		setTeacherCount(querySnapshot.size);
	};

	const fetchStudentCount = async () => {
		const db = getFirestore();
		const querySnapshot = await getDocs(collection(db, "Student"));
		setStudentCount(querySnapshot.size);
	};

	useEffect(() => {
		const validateSession = async () => {
			const session = await AsyncStorage.getItem('userSession');
			if (session) {
				const { timestamp } = JSON.parse(session);
				const currentTime = new Date().getTime();

				// Check if session is still valid (within 24 hours)
				if (currentTime - timestamp <= sessionExpiryTime) {
					setIsAuthenticated(true); // Session is valid
					await fetchTeacherCount();
					await fetchStudentCount();
				} else {
					// Session expired, remove it and redirect to login
					await AsyncStorage.removeItem('userSession');
					navigation.navigate('LoginScreen');
				}
			} else {
				// No session found, redirect to login
				navigation.navigate('LoginScreen');
			}
			setLoading(false);
		};

		validateSession(); // Run session validation on mount
	}, []);

	if (loading) {
		// Show a loader while the session is being checked
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		);
	}

	if (!isAuthenticated) {
		// If not authenticated, return null to prevent rendering the page content
		return null;
	}

	return (
		<View>
			<StatusBar barStyle="light-content" backgroundColor="#7781FB" />
			<View style={styles.header}>
				<TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
					<AntDesign name="arrowleft" size={24} color="#fff" style={{ marginLeft: 20 }} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Dashboard</Text>
				<TouchableOpacity onPress={handleImagePress}>
					<Image
						source={require('../../assets/images/user.png')}
						style={styles.userImage}
					/>
				</TouchableOpacity>
			</View>
			{/* Dropdown */}
			{dropdownVisible && (
				<View style={styles.dropdown}>
					<TouchableOpacity onPress={handleProfile} style={styles.dropdownItem}>
						<Text style={styles.dropdownText}>Profile</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={handleLogout} style={styles.dropdownItem}>
						<Text style={styles.dropdownText}>Logout</Text>
					</TouchableOpacity>
				</View>
			)}

			{/* Cards Section */}
			<ScrollView style={styles.ScrollView}>
				<View style={styles.cardContainer}>
					<Card style={styles.card} onPress={() => navigation.navigate('TeachersManagement')}>
						<Card.Title
							title="Teachers"
							titleStyle={styles.cardTitle}
							style={styles.cardTitleContainer} />
						<TouchableOpacity onPress={() => navigation.navigate('TeachersManagement')} style={styles.cardImageButton}>
							<FontAwesome5 name="chalkboard-teacher" size={24} color="#7781FB" />
						</TouchableOpacity>
						<Card.Content>
							<Text style={styles.cardContentText}>{teacherCount}</Text>
						</Card.Content>
						<TouchableOpacity onPress={() => navigation.navigate('AddTeachers')} style={styles.cardImageButton2}>
							<AntDesign name="adduser" size={27} color="red" />
						</TouchableOpacity>
					</Card>
				</View>
				<View style={styles.cardContainer}>
					<Card style={styles.card} onPress={() => navigation.navigate('StudentManagement')}>
						<Card.Title
							title="Students"
							titleStyle={styles.cardTitle}
							style={styles.cardTitleContainer} />
						<TouchableOpacity onPress={() => navigation.navigate('StudentManagement')} style={styles.cardImageButton}>
							<FontAwesome5 name="chalkboard-teacher" size={24} color="#7781FB" />
						</TouchableOpacity>
						<Card.Content>
							<Text style={styles.cardContentText}>{studentCount}</Text>
						</Card.Content>
						<TouchableOpacity onPress={() => navigation.navigate('AddStudents')} style={styles.cardImageButton2}>
							<AntDesign name="adduser" size={27} color="red" />
						</TouchableOpacity>
					</Card>
				</View>

				<View style={styles.cardContainer}>
					<Card style={styles.card1} onPress={() => navigation.navigate('MarkAttendance')}>
						<Card.Title
							title="Mark Attendance"
							titleStyle={styles.cardTitle1}
							style={styles.cardTitleContainer}
						/>
					</Card>
				</View>
				<View style={styles.cardContainer}>
					<Card style={styles.card2} onPress={() => navigation.navigate('AddClass')}>
						<Card.Title
							title="Add Classess"
							titleStyle={styles.cardTitle1}
							style={styles.cardTitleContainer}
						/>
					</Card>
				</View>
				<View style={styles.cardContainer}>
					<Card style={styles.card3} onPress={() => navigation.navigate('AttendanceReport')}>
						<Card.Title
							title="Attendence Report"
							titleStyle={styles.cardTitle1}
							style={styles.cardTitleContainer}
						/>
					</Card>
				</View>
			</ScrollView>

		</View>
	);
};

const styles = StyleSheet.create({
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
		flex: 2,
	},
	backButton: {
		position: 'flex',
		left: 20,
	},
	userImage: {
		width: 35,
		height: 35,
		borderRadius: 20,
		position: 'flex',
		right: 20,
	},
	dropdown: {
		position: 'absolute',
		top: 50,
		right: 30,
		backgroundColor: '#fff',
		borderRadius: 8,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
		elevation: 5,
		zIndex: 1,
		width: 100,
		display: 'flex',
		alignItems: 'center',
	},
	dropdownItem: {
		padding: 10,
	},
	dropdownText: {
		color: '#000',
		fontSize: 16,
	},
	cardContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		marginTop: 20,
		paddingHorizontal: 20,
		marginBottom: 10,
	},
	card: {
		width: '100%',
		backgroundColor: '#fff',
	},
	card1: {
		width: '100%',
		backgroundColor: '#606cfc',
	},
	card2: {
		width: '100%',
		backgroundColor: '#60fc70',
	},
	card3: {
		width: '100%',
		backgroundColor: '#9263ff',
	},
	cardTitle: {
		paddingTop: 10,
		color: '#808080',
		fontSize: 25,     
		fontWeight: '700',

	},
	cardTitle1: {
		paddingTop: 10,
		color: '#ffffff',
		fontSize: 25,
		fontWeight: '700',
		textAlign: 'center',
	},


	cardContentText: {
		color: 'Black',
		fontSize: 35,
		paddingTop: 10,
		fontWeight: 'bold',
		paddingBottom: 10,
	},
	cardImageButton: {
		position: 'absolute',
		right: 20,
		top: 12,
	},

	cardUserImage: {
		width: 35,
		height: 35,
		borderRadius: 20,
	},
	cardImageButton2: {
		position: 'absolute',
		right: 20,
		bottom: 16,
	},
	cardUserImage2: {
		width: 35,
		height: 35,
		borderRadius: 20,
	},
	ScrollView: {
		height: '100%',
	},



})
export default ManageDashboard;