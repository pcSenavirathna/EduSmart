import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, Animated, RefreshControl } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { DB } from '../../utils/DBConnect';
import { AppView } from '../../components/AppView';
import { AppText } from '../../components/AppText';

export default function ParentNotification({ route }) {
  const { studentId } = route.params; 
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  console.log('studentId:', studentId);

  useEffect(() => {
    const q = query(collection(DB, "StudentAttendance"), where("studentId", "==", studentId));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notificationsList = [];
      const uniqueKeys = new Set();
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const key = `${data.class}-${data.teacher}-${data.timestamp}`;
        if (!uniqueKeys.has(key)) {
          uniqueKeys.add(key);
          notificationsList.push({ id: doc.id, ...data });
        }
      });
      setNotifications(notificationsList);
    });

    return () => unsubscribe();
  }, [studentId]);

  const renderNotification = ({ item, index }) => {
    const translateY = new Animated.Value(50);
    const opacity = new Animated.Value(0);

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();

    return (
      <Animated.View style={{ transform: [{ translateY }], opacity }}>
        <Card style={[styles.card, { borderLeftColor: getColorForClass(item.class) }]}>
          <Card.Content>
            <Title>{item.class}</Title>
            <Paragraph>Teacher: {item.teacher}</Paragraph>
            <Paragraph>Start Time: {new Date(item.startTime).toLocaleTimeString()}</Paragraph>
            <Paragraph>End Time: {new Date(item.endTime).toLocaleTimeString()}</Paragraph>
            <Paragraph>Scanned At: {new Date(item.scannedAt).toLocaleString()}</Paragraph>
          </Card.Content>
        </Card>
      </Animated.View>
    );
  };

  const getColorForClass = (className) => {
    const colorMap = {
      'Class A': '#FF6B6B',
      'Class B': '#4ECDC4',
      'Class C': '#45B7D1',
    };
    return colorMap[className] || '#FFA500';
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Implement refresh logic here
    setTimeout(() => setRefreshing(false), 2000);
  };

  return (
    <AppView style={styles.container}>
      <AppText style={styles.title}>Attendance Notifications</AppText>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
  card: {
    marginBottom: 10,
    borderLeftWidth: 5,
  },
});