// /components/Profile/AuthActionItem.js

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AuthActionItem({ icon, label, onPress, rightElement, color = '#333' }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      <View style={styles.iconBox}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.label, { color }]}>{label}</Text>
      <View style={styles.right}>{rightElement}</View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  iconBox: {
    width: 28,
  },
  label: {
    flex: 1,
    fontSize: 15,
  },
  right: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
