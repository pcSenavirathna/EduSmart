import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../components/AppText';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <AppText type="title">Settings</AppText>
      <AppText>This is the settings screen.</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
