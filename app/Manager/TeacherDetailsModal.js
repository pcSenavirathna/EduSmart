import React, { useState } from 'react';
import { Modal, View, Text, Image, TouchableOpacity, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { DB } from '../../utils/DBConnect';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import Lottie from 'lottie-react-native';
import LottieView from 'lottie-react-native';

const TeacherDetailsModal = ({ visible, teacher, onClose, onTeacherDeleted, onTeacherUpdated }) => {
	const [isUpdating, setIsUpdating] = useState(false); // State to manage update form visibility
	const [updatedTeacher, setUpdatedTeacher] = useState(teacher); // State to store updated teacher details
	const [loading, setLoading] = useState(false);
	const [showAnimation, setShowAnimation] = useState(false);
	const [showAnimation1, setShowAnimation1] = useState(false);

	if (!teacher) return null;

	const handleDelete = () => {
		Alert.alert(
			"Confirm Deletion",
			"Are you sure you want to delete this teacher?",
			[
				{ text: "No", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
				{
					text: "Yes",
					onPress: async () => {
						try {
							setLoading(true);
							const studentRef = doc(DB, "Teacher", teacher.id);
							await deleteDoc(studentRef, updatedTeacher);
							setShowAnimation1(true);

							setTimeout(() => {
								setShowAnimation1(false);
								onTeacherDeleted(teacher.id);
								onClose();
							}, 3000);
							console.log("Teacher deleted successfully");
							// Close the modal after deletion
						} catch (error) {
							console.error("Error deleting teacher: ", error);
						} finally {
							setLoading(false);
						}
					}
				}
			],
			{ cancelable: true }
		);
	};

	const handleUpdate = () => {
		setIsUpdating(true); // Switch to update mode
		setUpdatedTeacher(teacher); // Pre-fill with the teacher's current data
	};

	const handleUpdateDone = async () => {
		try {
			setLoading(true);

			const studentRef = doc(DB, "Teacher", teacher.id);
			await updateDoc(studentRef, updatedTeacher); // Update Firestore with new data
			setShowAnimation(true);

			setTimeout(() => {
				setShowAnimation(false);
				setIsUpdating(false); // Exit update mode after animation
				onTeacherUpdated(teacher.id); // Notify parent component of update
				onClose();

			}, 3000);
			console.log("Teacher updated successfully");



		} catch (error) {
			console.error("Error updating teacher: ", error);
		} finally {
			setLoading(false); // Stop loading animation
		}
	};

	const handleCancelUpdate = () => {
		setIsUpdating(false); // Cancel the update process
	};

	const handleInputChange = (field, value) => {
		setUpdatedTeacher({ ...updatedTeacher, [field]: value }); // Update teacher details
	};

	return (
		<Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
			<View style={styles.modalContainer}>
				<View style={styles.modalContent}>
					<Image source={{ uri: teacher.profileImage }} style={styles.modalImage} />
					{!isUpdating ? (
						<>
							{/* Show teacher details */}
							<View style={styles.table}>
								<View style={styles.tableRow}>
									<Text style={styles.tableCellHeader}>Field</Text>
									<Text style={styles.tableCellHeader}>Details</Text>
								</View>
								<View style={styles.tableRow}>
									<Text style={styles.tableCell}>Name:</Text>
									<Text style={styles.tableCell}>{teacher.name}</Text>
								</View>
								<View style={styles.tableRow}>
									<Text style={styles.tableCell}>Email:</Text>
									<Text style={styles.tableCell}>{teacher.email}</Text>
								</View>
								<View style={styles.tableRow}>
									<Text style={styles.tableCell}>Contact:</Text>
									<Text style={styles.tableCell}>{teacher.contact}</Text>
								</View>
								<View style={styles.tableRow}>
									<Text style={styles.tableCell}>subject:</Text>
									<Text style={styles.tableCell}>{teacher.subject}</Text>
								</View>
								<View style={styles.tableRow}>
									<Text style={styles.tableCell}>Username:</Text>
									<Text style={styles.tableCell}>{teacher.username}</Text>
								</View>
								<View style={styles.tableRow}>
									<Text style={styles.tableCell}>Password:</Text>
									<Text style={styles.tableCell}>{teacher.password}</Text>
								</View>
								{/* Add more rows if needed */}
							</View>

							{/* Action buttons */}
							<TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
								<Text style={styles.closeButtonText}>Update</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.deleteButton} onPress={handleDelete} disabled={loading}>
								<Text style={styles.closeButtonText}>{loading ? <ActivityIndicator size="small" color="#fff" /> : 'Delete'}</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.closeButton} onPress={onClose}>
								<Text style={styles.closeButtonText}>Close</Text>
							</TouchableOpacity>
						</>
					) : (
						<>
							{/* Update form */}
							<View style={styles.table1}>
								<View style={styles.tableRow1}>
									<Text style={styles.tableCellHeader1}>Field</Text>
									<Text style={styles.tableCellHeader1}>Details</Text>
								</View>

								{/* Name Field */}
								<View style={styles.tableRow1}>
									<Text style={styles.tableCell1}>Name:</Text>
									<TextInput
										style={styles.input1}
										value={updatedTeacher.name}
										onChangeText={(text) => handleInputChange('name', text)}
										placeholder="Name"
									/>
								</View>

								{/* Email Field */}
								<View style={styles.tableRow1}>
									<Text style={styles.tableCell1}>Email:</Text>
									<TextInput
										style={styles.input1}
										value={updatedTeacher.email}
										onChangeText={(text) => handleInputChange('email', text)}
										placeholder="Email"
									/>
								</View>

								{/* Contact Field */}
								<View style={styles.tableRow1}>
									<Text style={styles.tableCell1}>Contact:</Text>
									<TextInput
										style={styles.input1}
										value={updatedTeacher.contact}
										onChangeText={(text) => handleInputChange('contact', text)}
										placeholder="Contact"
									/>
								</View>

								{/* subject Field */}
								<View style={styles.tableRow1}>
									<Text style={styles.tableCell1}>subject:</Text>
									<TextInput
										style={styles.input1}
										value={updatedTeacher.subject}
										onChangeText={(text) => handleInputChange('subject', text)}
										placeholder="subject"
									/>
								</View>
								{/* username Field */}
								<View style={styles.tableRow1}>
									<Text style={styles.tableCell1}>username:</Text>
									<TextInput
										style={styles.input1}
										value={updatedTeacher.username}
										onChangeText={(text) => handleInputChange('username', text)}
										placeholder="username"
									/>
								</View>
								{/* Password Field */}
								<View style={styles.tableRow1}>
									<Text style={styles.tableCell1}>Password:</Text>
									<TextInput
										style={styles.input1}
										value={updatedTeacher.password}
										onChangeText={(text) => handleInputChange('password', text)}
										placeholder="Password"
										secureTextEntry={true}
									/>
								</View>
							</View>

							{/* Add more fields as necessary */}

							{/* Update form buttons */}
							<TouchableOpacity style={styles.updateButton} onPress={handleUpdateDone} disabled={loading}>
								<Text style={styles.closeButtonText}>{loading ? <ActivityIndicator size="small" color="#fff" /> : 'Update Done'}</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.closeButton} onPress={handleCancelUpdate}>
								<Text style={styles.closeButtonText}>Cancel</Text>
							</TouchableOpacity>
						</>
					)}
				</View>
				{showAnimation && (
					<Modal visible={showAnimation} transparent={true}>
						<View style={styles.animationContainer}>
							<LottieView
								source={require('../../assets/animations/update.json')} // Replace with your path
								autoPlay
								loop={false}
								style={styles.animation}
							/>
						</View>
					</Modal>
				)}
				{showAnimation1 && (
					<Modal visible={showAnimation1} transparent={true}>
						<View style={styles.animationContainer}>
							<LottieView
								source={require('../../assets/animations/delete.json')} // Replace with your path
								autoPlay
								loop={false}
								style={styles.animation}
							/>
						</View>
					</Modal>
				)}


			</View>
		</Modal>

	);
};

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContent: {
		width: '80%',
		padding: 20,
		backgroundColor: '#fff',
		borderRadius: 10,
		alignItems: 'center',
	},
	modalImage: {
		width: 100,
		height: 100,
		borderRadius: 50,
		marginBottom: 20,
	},
	modalText: {
		fontSize: 18,
		marginVertical: 5,
		fontWeight: 'bold',
	},
	closeButtonText: {
		color: '#fff',
		fontWeight: 'bold',
	},
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
	modalContent: {
		backgroundColor: '#fff',
		padding: 20,
		borderRadius: 10,
		width: '90%',
	},
	modalImage: {
		width: 100,
		height: 100,
		borderRadius: 50,
		alignSelf: 'center',
		marginBottom: 20,
	},
	table: {
		borderWidth: 1,
		borderColor: '#000',
		marginBottom: 20,
	},
	tableRow: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderColor: '#000',
	},
	tableCell: {
		flex: 1,
		padding: 10,
		borderRightWidth: 1,
		borderColor: '#000',
		textAlign: 'Left',
	},
	tableCellHeader: {
		flex: 1,
		padding: 10,
		backgroundColor: '#f0f0f0',
		fontWeight: 'bold',
		textAlign: 'center',
		borderRightWidth: 1,
		borderColor: '#000',
	},
	closeButton: {
		backgroundColor: '#7781FB',
		padding: 10,
		borderRadius: 5,
		alignItems: 'center',
		marginTop: 20,
	},
	updateButton: {
		backgroundColor: '#10cc23',
		padding: 10,
		borderRadius: 5,
		alignItems: 'center',
		marginTop: 20,
	},
	DeleteButton: {
		backgroundColor: 'red',
		padding: 10,
		borderRadius: 5,
		alignItems: 'center',
		marginTop: 20,
	},
	closeButtonText: {
		color: '#fff',
		fontWeight: 'bold',
	},
	input: {
		width: '100%',
		padding: 10,
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		marginBottom: 10,
	},
	updateButton: {
		backgroundColor: '#10cc23',
		padding: 10,
		borderRadius: 5,
		alignItems: 'center',
		marginTop: 20,
	},
	deleteButton: {
		backgroundColor: 'red',
		padding: 10,
		borderRadius: 5,
		alignItems: 'center',
		marginTop: 20,
	},
	closeButton: {
		backgroundColor: '#7781FB',
		padding: 10,
		borderRadius: 5,
		alignItems: 'center',
		marginTop: 20,
	},
	closeButtonText: {
		color: '#fff',
		fontWeight: 'bold',
	},
	tableRow1: {
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderColor: '#000',
	},
	tableCell1: {
		flex: 1,
		padding: 10,
		borderRightWidth: 1,
		borderColor: '#000',
		textAlign: 'left',
	},
	input1: {
		flex: 1,
		padding: 10,
		borderColor: '#ccc',
		borderWidth: 1,
		borderRadius: 5,
		textAlign: 'left',
	},
	tableCellHeader1: {
		flex: 1,
		padding: 10,
		backgroundColor: '#f0f0f0',
		fontWeight: 'bold',
		textAlign: 'center',
		borderRightWidth: 1,
		borderColor: '#000',
	},
	loadingAnimation: {
		width: 100,
		height: 100,
	},
	animationContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	animation: {
		width: 200,
		height: 200,
	},

});

export default TeacherDetailsModal;
