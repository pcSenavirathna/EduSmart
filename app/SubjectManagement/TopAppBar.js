import React from 'react';
import { Appbar} from 'react-native-paper';
import { StyleSheet,  Animated, Easing} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';

const TopAppBar = ({ title, onBackPress }) => {

    const navigation = useNavigation();

    const handleIconPress = () => {
        navigation.navigate('Menu'); 
    };

    return (
        <Appbar.Header style={styles.header}>
            {onBackPress && (
                <Appbar.BackAction color='#ffffff' onPress={onBackPress} />
            )}
            <Appbar.Content title={title} titleStyle={styles.title} />

            <Appbar.Action 
                icon="menu" 
                color="#ffffff" 
                onPress={handleIconPress} 
            />
        </Appbar.Header>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5, 
        borderRadius: 20,
        overflow: 'hidden', 
        marginHorizontal: 10, 
        marginTop: 10,
    },
    header: {
        backgroundColor: '#7781FB', 
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'thin', 
        color: 'white',
    },
    backBtn: {
        color: '#ffffff',
    },
    imageButton: {
        marginRight: 15, 
    },
    imageIcon: {
        width: 24, 
        height: 24,
    },
});

export default TopAppBar;
