import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { AppView } from '../components/AppView';
import { AppText } from '../components/AppText';
import { Colors } from '../constants/Colors';
import { useUser } from '../hooks/UserContext';

export default function ProfileScreen() {
  const { user } = useUser();

  return (
    <AppView style={styles.container}>
      <View style={styles.header}>
        <Image
          //source={require('../assets/images/profile-placeholder.png')}
          style={styles.profileImage}
        />
        <AppText type="title" style={styles.name}>{user?.name || 'User Name'}</AppText>
        <AppText style={styles.userType}>{user?.userType || 'User Type'}</AppText>
      </View>

      <View style={styles.infoContainer}>
        <InfoItem label="Email" value={user?.email || 'email@example.com'} />
        <InfoItem label="ID" value={user?.id || 'User ID'} />
        {user?.userType === 'student' && (
          <InfoItem label="Student ID" value={user?.studentId || 'Student ID'} />
        )}
      </View>
    </AppView>
  );
}

const InfoItem = ({ label, value }) => (
  <View style={styles.infoItem}>
    <AppText style={styles.label}>{label}:</AppText>
    <AppText style={styles.value}>{value}</AppText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  userType: {
    fontSize: 16,
    color: Colors.light.text,
    marginTop: 5,
  },
  infoContainer: {
    backgroundColor: Colors.light.background,
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  value: {
    color: Colors.light.text,
  },
});
