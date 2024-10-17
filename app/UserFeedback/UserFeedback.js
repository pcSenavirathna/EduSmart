import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image, TextInput, ScrollView, KeyboardAvoidingView, Modal, Platform, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation, useRoute, } from '@react-navigation/native';
import Lottie from 'lottie-react-native';
import EmojiSlider from "./EmojiSlider";
import { DB } from '../../utils/DBConnect';
import { doc, getDoc, collection, addDoc, getDocs, setDoc } from 'firebase/firestore';
import LottieView from 'lottie-react-native';


const UserFeedback = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const { classId, className, teacherId, subject, instituteName, currentLesson } = route.params;

	const [feedbackText, setFeedbackText] = useState('');
	const [selectedEmoji, setSelectedEmoji] = useState(0);
	const [loading, setLoading] = useState(false);
	const [showAnimation, setShowAnimation] = useState(false);

	const handleBackPress = () => {
		navigation.goBack();
	};

	const handleSubmit = async () => {
		if (!feedbackText.trim()) {
			Alert.alert("Error", "Please enter your feedback.");
			return;
		}

		try {

			setLoading(true);

			const feedbackCollectionRef = collection(DB, "feedback"); // Adjust collection name as needed
			await addDoc(feedbackCollectionRef, {
				classId,
				rating: selectedEmoji, // Adjust rating to 1-5 scale
				feedback: feedbackText,
				teacherId: teacherId,
				createdAt: new Date(), // Add timestamp if needed
			});

			const classDocRef = doc(DB, "class", classId);
			const classDoc = await getDoc(classDocRef);
			const teacherName = classDoc.exists() ? classDoc.data().teacherId : ''; // Adjust field name accordingly

			const feedbackSnapshot = await getDocs(collection(DB, "feedback"));
			let totalRating = 0;

			feedbackSnapshot.forEach((doc) => {
				const data = doc.data();
				if (data.classId === classId) {
					totalRating += data.rating;

				}
			});

			const feedbackDocRef = doc(DB, "new_feedback", classId);

			const feedbackDoc = await getDoc(feedbackDocRef);


			if (feedbackDoc.exists()) {
				// If classId exists, update the rating and other fields
				await setDoc(feedbackDocRef, {
					rating: selectedEmoji, // Update the rating (adjust as per your logic)
					totalRating: feedbackDoc.data().totalRating + selectedEmoji, // Update total rating (example logic)
					feedback: feedbackText, // Optional: update the feedback
					teacherId: teacherId, // Optional: update teacher info
				}, { merge: true }); // Merge: only update the specified fields without overwriting the document
			} else {
				// If classId doesn't exist, create a new document
				await setDoc(feedbackDocRef, {
					classId, // Unique classId
					rating: selectedEmoji + 1, // New rating
					totalRating: selectedEmoji + 1, // Initialize total rating
					feedback: feedbackText, // Add feedback
					teacherId: teacherId, // Add teacherId
					createdAt: new Date(), // Timestamp if needed
				});
			}

			setShowAnimation(true);

			setTimeout(() => {
				setShowAnimation(false);
				setFeedbackText('');
				setSelectedEmoji(0);
			}, 3000);

		} catch (error) {
			console.error("Error submitting feedback:", error);
			Alert.alert("Error", "There was a problem submitting your feedback.");
		}
		finally {
			setLoading(false);
		}
	};

	return (
		<View style={{ flex: 1, backgroundColor: 'white' }}>
			<StatusBar barStyle="light-content" backgroundColor="#7781FB" />
			<View style={styles.header}>
				<TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
					<AntDesign name="arrowleft" size={24} color="#fff" style={{ marginLeft: 20 }} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Review joined class</Text>
				<Image source={require('../../assets/images/user.png')} style={styles.userImage} />
			</View>
			<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
				<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
					<View>
						<Text style={{ fontSize: 23, marginTop: 20, marginLeft: 20, fontWeight: 'bold', color: '#7781FB' }}>Review joined class</Text>
					</View>
					<View>
						<Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 25, marginLeft: 20, color: 'black' }}>{className}</Text>
					</View>
					<View>
						<Text style={{ fontSize: 20, marginLeft: 20, color: 'black' }}>{subject}</Text>
					</View>
					<View>
						<Text style={{ fontSize: 18, marginTop: 5, marginLeft: 20, color: 'black' }}>{teacherId}</Text>
					</View>
					<View>
						<Text style={{ fontSize: 17, marginTop: 5, marginLeft: 20, color: 'black', fontWeight: '300' }}>institute Name - {instituteName}</Text>
					</View>
					<Lottie source={require('../../assets/animations/first-place-badge.json')} autoPlay loop style={{ width: 40, height: 40, marginTop: 25, alignSelf: 'center' }} />
					<View>
						<Text style={{ fontSize: 17, marginTop: 10, fontWeight: 'bold', color: '#7781FB', textAlign: 'center' }}>Current lesson</Text>
					</View>
					<View>
						<Text style={{ fontSize: 20, marginTop: 5, fontWeight: 'bold', color: 'black', textAlign: 'center' }}>{currentLesson}</Text>
					</View>
					<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30 }}>
						<Lottie source={require('../../assets/animations/medal.json')} autoPlay loop style={{ width: 70, height: 70 }} />
						<Text style={{ fontSize: 20, fontWeight: 'bold', color: '#7781FB', textAlign: 'center' }}>Review class under lesson</Text>
					</View>
					<View style={{ justifyContent: "center", alignItems: "center" }}>
						<View>
							<EmojiSlider onRatingChange={setSelectedEmoji} />
						</View>
					</View>
					<View>
						<TextInput
							style={{
								borderWidth: 2,
								borderColor: '#7781FB',
								borderRadius: 10,
								marginTop: 15,
								marginLeft: 20,
								marginRight: 20,
								padding: 10,
								height: 80,
							}}
							multiline={true}
							numberOfLines={3}
							placeholder="Type your feedback here..."
							value={feedbackText}
							onChangeText={setFeedbackText}
						/>
					</View>
					<View>
						<TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading} >
							<Text style={styles.buttonText}>{loading ? <ActivityIndicator size="small" color="#fff" /> : 'Submit Feedback'}</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
				{showAnimation && (
					<Modal visible={showAnimation} transparent={true}>
						<View style={styles.animationContainer}>
							<LottieView
								source={require('../../assets/animations/thank.json')} // Replace with your path
								autoPlay
								loop={false}
								style={styles.animation}
							/>
						</View>
					</Modal>
				)}
			</KeyboardAvoidingView>
		</View>
	);
};

export default UserFeedback;

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

	text: {
		textAlign: "center",
		marginTop: 70,
		fontSize: 25,
		fontWeight: "bold",
		color: "#555555",
	},

	button: {
		backgroundColor: '#7781FB',
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderRadius: 10,
		marginVertical: 20,
		marginHorizontal: 20,
		alignItems: 'center',
	},
	buttonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: 'bold',
	},
	animation: {
		width: 300,
		height: 300,
		borderRadius: 20,

	},
	animationContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',

	},
});
