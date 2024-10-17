import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

const TimePicker = ({ time, onTimeChange }) => {
    const [showTimePicker, setShowTimePicker] = useState(false);

    const handleTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || time;
        setShowTimePicker(Platform.OS === 'ios');
        onTimeChange(currentTime);
    };

    return (
        <View style={styles.container}>
            <Button
                mode="text"
                onPress={() => setShowTimePicker(true)}
                style={styles.button}
                labelStyle={styles.buttonLabel}
            >
                Select Time
            </Button>
            <Text style={styles.timeText}>
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {showTimePicker && (
                <DateTimePicker
                    value={time}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    timeText: {
        marginRight: 10,
    },
    button: {
        borderRadius: 0,
    },
    buttonLabel: {
        fontSize: 14,
    },
});

export default TimePicker;