import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePicker = ({ date, onDateChange }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        onDateChange(currentDate);
    };

    return (
        <View style={styles.container}>
            <Button
                mode="text"
                onPress={() => setShowDatePicker(true)}
                style={styles.button}
                labelStyle={styles.buttonLabel}
            >
                Select Date
            </Button>
            <Text style={styles.dateText}>{date.toDateString()}</Text>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
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
    dateText: {
        marginRight: 10,
    },
    button: {
        borderRadius: 0,
    },
    buttonLabel: {
        fontSize: 14,
    },
});

export default DatePicker;
