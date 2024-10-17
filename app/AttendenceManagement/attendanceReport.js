import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Button, Card, Title, Paragraph, FAB } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { DB } from '../../utils/DBConnect';
import { AppView } from '../../components/AppView';
import { AppText } from '../../components/AppText';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

export default function AttendanceReport() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    fetchAttendanceData(currentDate);
  };

  const fetchAttendanceData = async (selectedDate) => {
    const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

    const q = query(
      collection(DB, "AttendanceSessions"),
      where("timestamp", ">=", startOfDay.toISOString()),
      where("timestamp", "<=", endOfDay.toISOString())
    );

    const querySnapshot = await getDocs(q);
    const data = await Promise.all(querySnapshot.docs.map(async doc => {
      const sessionData = doc.data();
      const studentCountQuery = query(
        collection(DB, "StudentAttendance"),
        where("class", "==", sessionData.class),
        where("teacher", "==", sessionData.teacher),
        where("timestamp", "==", sessionData.timestamp)
      );
      const studentCountSnapshot = await getDocs(studentCountQuery);
      const uniqueStudentIds = new Set(
        studentCountSnapshot.docs.map(doc => doc.data().studentId)
      );
      return { 
        id: doc.id, 
        ...sessionData, 
        studentCount: uniqueStudentIds.size 
      };
    }));
    setAttendanceData(data);
  };

  useEffect(() => {
    fetchAttendanceData(date);
  }, []);

  const renderAttendanceItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.class}</Title>
        <Paragraph>Teacher: {item.teacher}</Paragraph>
        <Paragraph>Start Time: {new Date(item.startTime).toLocaleTimeString()}</Paragraph>
        <Paragraph>End Time: {new Date(item.endTime).toLocaleTimeString()}</Paragraph>
        <Paragraph>Attending Students: {item.studentCount}</Paragraph>
      </Card.Content>
    </Card>
  );

  const generatePDFReport = async () => {
    let htmlContent = `
      <div style="margin: 20px;">
        <center><h1 style="color: #4CAF50;">Attendance Insights</h1></center>
        <div style="display: flex; justify-content: space-between;">
          <p><strong>Date:</strong> ${date.toDateString()}</p>
          <p><strong>Total Sessions:</strong> ${attendanceData.length}</p>
        </div>
        <hr>
    `;

    let totalAttendance = 0;
    let highestAttendance = { class: '', count: 0 };
    let lowestAttendance = { class: '', count: Infinity };

    attendanceData.forEach(session => {
      totalAttendance += session.studentCount;
      if (session.studentCount > highestAttendance.count) {
        highestAttendance = { class: session.class, count: session.studentCount };
      }
      if (session.studentCount < lowestAttendance.count) {
        lowestAttendance = { class: session.class, count: session.studentCount };
      }
      htmlContent += `
        <div style="margin-bottom: 20px;">
          <h2 style="color: #2196F3;">${session.class} (${session.teacher})</h2>
          <p><strong>Time:</strong> ${new Date(session.startTime).toLocaleTimeString()} - ${new Date(session.endTime).toLocaleTimeString()}</p>
          <p><strong>Attendance:</strong> ${session.studentCount}</p>
        </div>
      `;
    });

    htmlContent += `
        <div style="position: fixed; bottom: 20px; left: 20px; right: 20px;">
          <hr>
          <h2 style="color: #FF9800;">Summary</h2>
          <div style="display: flex; justify-content: space-between;">
            <div>
              <p><strong>Highest Attendance:</strong> ${highestAttendance.class} (${highestAttendance.count})</p>
            </div>
            <div>
              <p><strong>Lowest Attendance:</strong> ${lowestAttendance.class} (${lowestAttendance.count})</p>
            </div>
          </div>
        </div>
      </div>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error('Error generating PDF report:', error);
    }
  };
  return (
    <AppView style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.title}>Attendance Report</AppText>
        <FAB
          icon="file-pdf-box"
          style={styles.fab}
          onPress={generatePDFReport}
          small
        />
      </View>
      <Button onPress={() => setShowDatePicker(true)} mode="outlined" style={styles.dateButton}>
        {date.toDateString()}
      </Button>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      <AppText style={styles.totalAttendance}>
        Total Sessions: {attendanceData.length}
      </AppText>
      <FlatList
        data={attendanceData}
        renderItem={renderAttendanceItem}
        keyExtractor={item => item.id}
      />
    </AppView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dateButton: {
    marginBottom: 20,
  },
  totalAttendance: {
    fontSize: 18,
    marginBottom: 10,
  },
  card: {
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  fab: {
    //backgroundColor: '#4CAF50',
  },
});