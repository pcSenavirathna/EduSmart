import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { DB } from '../../utils/DBConnect';
import { AppView } from '../../components/AppView';
import { AppText } from '../../components/AppText';
import { useNavigation } from '@react-navigation/native';

export default function StudentAttend({route}) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();
  const { studentId } = route.params;
  console.log('studentId:', studentId);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);

    const [classValue, teacherValue, timestamp, startTime, endTime] = data.split('@');

    const isValidISODate = (dateString) => !isNaN(new Date(dateString).getTime());

    if (isValidISODate(startTime) && isValidISODate(endTime) && isValidISODate(timestamp)) {
      try {
        // Check if attendance already exists
        const attendanceQuery = query(
          collection(DB, "StudentAttendance"),
          where("studentId", "==", studentId),
          where("class", "==", classValue),
          where("teacher", "==", teacherValue),
          where("timestamp", "==", timestamp)
        );
      
        const querySnapshot = await getDocs(attendanceQuery);
      
        if (!querySnapshot.empty) {
          Alert.alert(
            "Already Marked",
            "You have already marked attendance for this class.",
            [{ text: "OK", onPress: () => navigation.navigate('Home') }]
          );
          return;
        }

        // If no existing attendance, proceed to add new attendance
        await addDoc(collection(DB, "StudentAttendance"), {
          studentId: studentId,
          class: classValue,
          teacher: teacherValue,
          timestamp: timestamp,
          startTime: startTime,
          endTime: endTime,
          scannedAt: new Date().toISOString()
        });

        Alert.alert(
          "Success",
          "Attendance marked successfully! Parent notified.",
          [{ text: "OK", onPress: () => navigation.navigate('Home') }]
        );
      } catch (error) {
        console.error('Error marking attendance:', error);
        Alert.alert("Error", "Failed to mark attendance. Please try again.");
      }
    } else {
      Alert.alert("Invalid QR Code", "The QR code data is not valid.");
    }
  };  
  if (hasPermission === null) {
    return <AppText>Requesting for camera permission</AppText>;
  }
  if (hasPermission === false) {
    return <AppText>No access to camera</AppText>;
  }

  return (
    <AppView style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button mode="contained" onPress={() => setScanned(false)} style={styles.button}>
          Tap to Scan Again
        </Button>
      )}
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  button: {
    margin: 20,
  },
});