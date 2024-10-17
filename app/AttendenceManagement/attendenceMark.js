  import React, { useState } from 'react';
  import { View, StyleSheet, Alert } from 'react-native';
  import { Button, IconButton } from 'react-native-paper';
  import DropDownPicker from 'react-native-dropdown-picker';
  import QRCode from 'react-native-qrcode-svg';
  import { addDoc, collection, updateDoc, doc, deleteDoc } from 'firebase/firestore';
  import { DB } from '../../utils/DBConnect';
  import { AppView } from '../../components/AppView';
  import { AppText } from '../../components/AppText';
  import DateTimePicker from '@react-native-community/datetimepicker';

  export default function AttendenceMark() {
    const [openClass, setOpenClass] = useState(false);
    const [openTeacher, setOpenTeacher] = useState(false);
    const [classValue, setClassValue] = useState(null);
    const [teacherValue, setTeacherValue] = useState(null);
    const [classes, setClasses] = useState([
      { label: 'Class A', value: 'classA' },
      { label: 'Class B', value: 'classB' },
      { label: 'Class C', value: 'classC' },
    ]);
    const [teachers, setTeachers] = useState([
      { label: 'Mr. Smith', value: 'smith' },
      { label: 'Ms. Johnson', value: 'johnson' },
      { label: 'Dr. Brown', value: 'brown' },
    ]);
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [qrValue, setQrValue] = useState('');
    const [currentSessionId, setCurrentSessionId] = useState(null);

    const onStartTimeChange = (event, selectedTime) => {
      setShowStartTimePicker(false);
      if (selectedTime) {
        setStartTime(selectedTime);
      }
    };

    const onEndTimeChange = (event, selectedTime) => {
      setShowEndTimePicker(false);
      if (selectedTime) {
        setEndTime(selectedTime);
      }
    };

    const generateQR = () => {
      if (classValue && teacherValue) {
        const timestamp = new Date().toISOString();
        const qrData = `${classValue}@${teacherValue}@${timestamp}@${startTime.toISOString()}@${endTime.toISOString()}`;
        setQrValue(qrData);
    
        addDoc(collection(DB, "AttendanceSessions"), {
          class: classValue,
          teacher: teacherValue,
          timestamp: timestamp,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          qrCode: qrData
        })
        .then((docRef) => {
          console.log('Attendance session created');
          Alert.alert(
            "Attendance session created"
          );
          
          setCurrentSessionId(docRef.id);
        })
        .catch((error) => {
          console.error('Error creating attendance session:', error);
        });
      }
    };

    const editSession = () => {
      if (currentSessionId) {
        updateDoc(doc(DB, "AttendanceSessions", currentSessionId), {
          class: classValue,
          teacher: teacherValue,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        })
        .then(() => {
          console.log('Attendance session updated');
          Alert.alert(
            "Attendance session updated"
          );
        })
        .catch((error) => {
          console.error('Error updating attendance session:', error);
        });
      }
    };

    const deleteSession = () => {
      if (currentSessionId) {
        deleteDoc(doc(DB, "AttendanceSessions", currentSessionId))
        .then(() => {
          console.log('Attendance session deleted');
          Alert.alert(
            "Attendance session deleted"
          );
          setCurrentSessionId(null);
          setQrValue('');
          // Clear selector values
      setClassValue(null);
      setTeacherValue(null);
      // Reset time values
      setStartTime(new Date());
      setEndTime(new Date());
        })
        .catch((error) => {
          console.error('Error deleting attendance session:', error);
        });
      }
    };

    return (
      <AppView style={styles.container}>
        <View style={styles.header}>
          <AppText style={styles.title}>Mark Attendance</AppText>
          <View style={styles.headerButtons}>
            <IconButton icon="pencil" onPress={editSession} />
            <IconButton icon="delete" onPress={deleteSession} />
          </View>
        </View>
              <View style={[styles.dropdownContainer, styles.classDropdown]}>
                <DropDownPicker
                  open={openClass}
                  value={classValue}
                  items={classes}
                  setOpen={setOpenClass}
                  setValue={setClassValue}
                  setItems={setClasses}
                  placeholder="Select a class"
                  zIndex={3000}
                  zIndexInverse={1000}
                />
              </View>

              <View style={[styles.dropdownContainer, styles.teacherDropdown]}>
                <DropDownPicker
                  open={openTeacher}
                  value={teacherValue}
                  items={teachers}
                  setOpen={setOpenTeacher}
                  setValue={setTeacherValue}
                  setItems={setTeachers}
                  placeholder="Select a teacher"
                  zIndex={2000}
                  zIndexInverse={2000}
                />
              </View>
        <Button onPress={() => setShowStartTimePicker(true)} mode="outlined" style={styles.timeButton}>
          Start Time: {startTime.toLocaleTimeString()}
        </Button>
        {showStartTimePicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onStartTimeChange}
          />
        )}

        <Button onPress={() => setShowEndTimePicker(true)} mode="outlined" style={styles.timeButton}>
          End Time: {endTime.toLocaleTimeString()}
        </Button>
        {showEndTimePicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onEndTimeChange}
          />
        )}
    
        <Button mode="contained" onPress={generateQR} style={styles.button}>
          Generate QR Code
        </Button>
    
        {qrValue ? (
          <View style={styles.qrContainer}>
            <QRCode value={qrValue} size={200} />
          </View>
        ) : null}
      </AppView>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    headerButtons: {
      flexDirection: 'row',
    },
    dropdownContainer: {
      marginBottom: 20,
      zIndex: 3000,
    },
    classDropdown: {
      zIndex: 3000,
    },
    teacherDropdown: {
      zIndex: 2000,
    },
    timeButton: {
      marginBottom: 10,
    },
    button: {
      marginTop: 20,
    },
    qrContainer: {
      alignItems: 'center',
      marginTop: 30,
    },
  });