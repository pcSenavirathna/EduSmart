import { View, Text, StatusBar, ActivityIndicator, TouchableOpacity, Image, StyleSheet, Platform, Dimensions, TextInput, FlatList, KeyboardAvoidingView, RefreshControl, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { BarChart } from 'react-native-chart-kit';
import { Card, Provider } from 'react-native-paper';
import { DB } from '../../utils/DBConnect';
import { collection, query, getDocs } from 'firebase/firestore';
import TeacherDetailsModal from './TeacherDetailsModal';
import LottieView from 'lottie-react-native';

const sessionExpiryTime = 24 * 60 * 60 * 1000;

const TeacherManagement = () => {
	const navigation = useNavigation();
	const [loading, setLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [dropdownVisible, setDropdownVisible] = useState(false);

	const [teachers, setTeachers] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedTeacher, setSelectedStudent] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);

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

	const onRefresh = async () => {
		setRefreshing(true);
		await fetchTeachers();
		setRefreshing(false);
	};


	const fetchTeachers = async () => {
		try {
			const studentCollection = collection(DB, 'Teacher');
			const querySnapshot = await getDocs(query(studentCollection));
			const teachersArray = [];
			querySnapshot.forEach((doc) => {
				const data = doc.data();
				teachersArray.push({
					id: doc.id,
					name: data.name,
					email: data.email,
					contact: data.contact,
					username: data.username,
					subject: data.subject,
					password: data.password,
					profileImage: data.imageUri,// profileImage: data.profileImage,
				});
			});
			setTeachers(teachersArray);
		} catch (error) {
			console.error('Error fetching teachers:', error);
		}
	};

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
		fetchTeachers();
	}, []);

	if (loading) {
		// Show loader while session is being validated
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		);
	}

	if (!isAuthenticated) {
		return null;
	}

	const handleStudentPress = (teacher) => {
		setSelectedStudent(teacher);
		setModalVisible(true);
	};

	const handleCloseModal = () => {
		setModalVisible(false);
		setSelectedStudent(null);
	};

	// Filter teachers based on the search query
	const filteredStudents = teachers.filter(teacher => {
		const queryLower = searchQuery.toLowerCase();
		return (
			(teacher.name && teacher.name.toLowerCase().includes(queryLower)) ||
			(teacher.email && teacher.email.toLowerCase().includes(queryLower))
		);
	});

	const handleTeacherDelete = (studentId) => {
		// Remove the deleted teacher from the list
		setTeachers(prevStudents => prevStudents.filter(teacher => teacher.id !== studentId));
	};

	const handleTeacherUpdated = () => {
		// Re-fetch the teachers to reflect updates
		fetchTeachers();
	};

	const handleRefresh = () => {
		fetchTeachers(); // Refresh the teachers list
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<KeyboardAvoidingView
				style={{ flex: 1, backgroundColor: 'white' }}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			>
				<Provider>
		<View>
			<StatusBar barStyle="light-content" backgroundColor="#7781FB" />
			<View style={styles.header}>
							<TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
					<AntDesign name="arrowleft" size={24} color="#fff" style={{ marginLeft: 20 }} />
				</TouchableOpacity>
							<Text style={styles.headerTitle}>View All Teachers</Text>
							<TouchableOpacity onPress={handleImagePress}>
								<Image source={require('../../assets/images/user.png')} style={styles.userImage} />
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



						{/* Search Bar */}
						<View style={styles.searchContainer}>
							<View style={styles.rowContainer}>
								<TextInput
									style={styles.searchInput}
									placeholder="Search Teacher..."
									value={searchQuery}
									onChangeText={setSearchQuery}
								/>
								{/* Add Teacher Button */}
								<TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddTeachers')}>
									<FontAwesome name="plus" size={24} color="#fff" />
								</TouchableOpacity>
							</View>
						</View>

						<FlatList style={styles.scrollView}
							data={filteredStudents} // Use filtered teachers for rendering
							renderItem={({ item }) => (
								<TouchableOpacity style={styles.squareButton} onPress={() => {
									setSelectedStudent(item);
									setModalVisible(true);
								}}>
									<Image source={{ uri: item.profileImage }} style={styles.profileImage} />
									<Text style={styles.buttonText}>{item.name.split(' ')[0]}</Text>
								</TouchableOpacity>
							)}
							keyExtractor={item => item.id}
							numColumns={3} // This ensures three cards per row
							columnWrapperStyle={styles.buttonRow} // This aligns items in rows
							refreshControl={
								<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />  // Implement refresh control
							}
						/>

						{/* Teacher Details Modal */}
						<TeacherDetailsModal
							visible={modalVisible}
							teacher={selectedTeacher}
							onClose={() => setModalVisible(false)}
							onTeacherDeleted={handleTeacherDelete}
							onTeacherUpdated={handleTeacherUpdated}
							onRefresh={handleRefresh}
						/>
					</View>
				</Provider>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);

}

export default TeacherManagement;

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
		flex: 1,
	},
	userImage: {
		width: 40,
		height: 40,
		borderRadius: 20,
		marginRight: 20,
	},
	scrollView: {
		height: '150%',
		marginBottom: 20,
	},
	dropdown: {
		position: 'absolute',
		top: 60,
		right: 20,
		backgroundColor: '#fff',
		borderRadius: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
		elevation: 5,
	},
	dropdownItem: {
		padding: 10,
	},
	dropdownText: {
		color: '#7781FB',
	},
	card: {
		margin: 20,
		borderRadius: 10,
		padding: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 1,
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	searchContainer: {
		paddingHorizontal: 20,
	},
	rowContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginVertical: 10,
	},
	searchInput: {
		flex: 1,
		borderColor: '#000',
		borderWidth: 1,
		borderRadius: 5,
		padding: 10,
		marginRight: 10,
		backgroundColor: '#fff',
	},
	addButton: {
		backgroundColor: '#7781FB',
		padding: 10,
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
	},
	squareButton: {
		backgroundColor: '#fff',
		height: 'fit-content',
		width: 'fit-content',
		margin: 10,
		borderRadius: 10,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 1,
		elevation: 2,
	},
	profileImage: {
		width: 100,
		height: 100,
		borderRadius: 10,
	},
	buttonText: {
		color: '#333',
		fontWeight: 'bold',
		textAlign: 'center',
		zIndex: 1,

	},
	buttonRow: {
		justifyContent: 'space-between',
	},


});
