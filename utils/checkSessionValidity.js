import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkSessionValidity = async () => {
	try {
		const sessionData = await AsyncStorage.getItem('session'); // Get session data from storage
		if (!sessionData) {
			return false; // No session found
		}

		const session = JSON.parse(sessionData);
		const currentTime = Date.now();
		const sessionExpiry = session.expiry; // Assuming the session has an expiry field

		// Check if the session is still valid (i.e., within 24 hours)
		if (currentTime > sessionExpiry) {
			return false; // Session expired
		}

		return true; // Session is valid
	} catch (error) {
		console.error('Error checking session validity:', error);
		return false;
	}
};
