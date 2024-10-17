import { View, Text, StatusBar, ActivityIndicator, TouchableOpacity, Image, StyleSheet, Platform, Dimensions, TextInput, FlatList, KeyboardAvoidingView, RefreshControl, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { BarChart } from 'react-native-chart-kit';
import { Card, Provider } from 'react-native-paper';
import { DB } from '../../utils/DBConnect';
import { collection, query, getDocs } from 'firebase/firestore';
import StudentDetailsModal from './StudentDetailsModal ';
import LottieView from 'lottie-react-native';

const sessionExpiryTime = 24 * 60 * 60 * 1000;

const StudentManagement = () => {
	const navigation = useNavigation();
	const [loading, setLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [dropdownVisible, setDropdownVisible] = useState(false);
	const [AlStreamCounts, setAlStreamCounts] = useState({
		maths: 0,
		science: 0,
		art: 0,
		tech: 0,
	});
	const [students, setStudents] = useState([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedStudent, setSelectedStudent] = useState(null);
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
		await fetchStudents();
		setRefreshing(false);
	};

	const fetchAlStreamData = async () => {
		try {
			const studentCollection = collection(DB, 'Student');
			const querySnapshot = await getDocs(query(studentCollection));
			const counts = {
				maths: 0,
				science: 0,
				art: 0,
				tech: 0,
			};


			querySnapshot.forEach((doc) => {
				const data = doc.data();
				// Assuming stream is stored in a field named 'stream'
				switch (data.stream) {
					case 'Maths':
						counts.maths++;
						break;
					case 'Science':
						counts.science++;
						break;
					case 'Art':
						counts.art++;
						break;
					case 'Tech':
						counts.tech++;
						break;
					default:
						break;
				}
			});

			setAlStreamCounts(counts);
		} catch (error) {
			console.error('Error fetching gender data:', error);
		}
	};

	const fetchStudents = async () => {
		try {
			const studentCollection = collection(DB, 'Student');
			const querySnapshot = await getDocs(query(studentCollection));
			const studentsArray = [];
			querySnapshot.forEach((doc) => {
				const data = doc.data();
				studentsArray.push({
					id: doc.id,
					name: data.name,
					email: data.email,
					contact: data.contact,
					guardian: data.guardian,
					guardianContact: data.guardian_Contact,
					stream: data.stream,
					password: data.password,
					profileImage: data.imageUri,// profileImage: data.profileImage,
				});
			});
			setStudents(studentsArray);
		} catch (error) {
			console.error('Error fetching students:', error);
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
		fetchAlStreamData(); // Call the new fetch function
		fetchStudents();
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

	const handleStudentPress = (student) => {
		setSelectedStudent(student);
		setModalVisible(true);
	};

	const handleCloseModal = () => {
		setModalVisible(false);
		setSelectedStudent(null);
	};

	// Filter students based on the search query
	const filteredStudents = students.filter(student => {
		const queryLower = searchQuery.toLowerCase();
		return (
			(student.name && student.name.toLowerCase().includes(queryLower)) ||
			(student.email && student.email.toLowerCase().includes(queryLower))
		);
	});

	const handleStudentDelete = (studentId) => {
		// Remove the deleted student from the list
		setStudents(prevStudents => prevStudents.filter(student => student.id !== studentId));
	};

	const handleStudentUpdated = () => {
		// Re-fetch the students to reflect updates
		fetchStudents();
	};

	const handleRefresh = () => {
		fetchStudents(); // Refresh the students list
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
				<Text style={styles.headerTitle}>View All Students</Text>
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

						<Card style={styles.card}>
							<Text style={styles.cardTitle}>Students by stream</Text>
							<BarChart
								data={{
									labels: ['Maths', 'Science', 'Art', 'Tech'],
									datasets: [
										{
											data: [
												AlStreamCounts.maths,
												AlStreamCounts.science,
												AlStreamCounts.art,
												AlStreamCounts.tech,
											],
											color: () => '#007BFF',
										},
									],
								}}
								width={Dimensions.get('window').width - 60}
								height={220}
								chartConfig={{
									backgroundColor: '#fff',
									backgroundGradientFrom: '#fff',
									backgroundGradientTo: '#fff',
									color: () => '#007BFF',
									style: {
										borderRadius: 16,
									},
									propsForBackgroundLines: {
										strokeDasharray: '',
										strokeWidth: 1,
										stroke: '#e4e4e4',
									},
								}}
								style={{
									marginVertical: 8,
									borderRadius: 16,
								}}
								withVerticalLabels={true}
								withHorizontalLines={true}
								verticalLabelRotation={15}
								fromZero={true}
								barPercentage={0.5}
								showValuesOnTopOfBars={true}
							/>
						</Card>

						{/* Search Bar */}
						<View style={styles.searchContainer}>
							<View style={styles.rowContainer}>
								<TextInput
									style={styles.searchInput}
									placeholder="Search Student..."
									value={searchQuery}
									onChangeText={setSearchQuery}
								/>
								{/* Add Student Button */}
								<TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddStudents')}>
									<FontAwesome name="plus" size={24} color="#fff" />
								</TouchableOpacity>
							</View>
						</View>

						<FlatList style={styles.scrollView}
							data={filteredStudents} // Use filtered students for rendering
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

						{/* Student Details Modal */}
						<StudentDetailsModal
							visible={modalVisible}
							student={selectedStudent}
							onClose={() => setModalVisible(false)}
							onStudentDeleted={handleStudentDelete}
							onStudentUpdated={handleStudentUpdated}
							onRefresh={handleRefresh}
						/>
					</View>
				</Provider>
			</KeyboardAvoidingView>
		</TouchableWithoutFeedback>
	);

}

export default StudentManagement;

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
