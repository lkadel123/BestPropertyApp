import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const quickLinks = [
  { icon: 'people-outline', label: 'User Management' },
  { icon: 'settings-outline', label: 'System Settings' },
  { icon: 'document-text-outline', label: 'Audit Logs' },
];

export default function AdminQuickLinks() {
  return (
    <View>
      <Text style={styles.title}>Quick Links</Text>
      {quickLinks.map((link, index) => (
        <TouchableOpacity key={index} style={styles.link}>
          <Ionicons name={link.icon} size={20} color="#333" />
          <Text style={styles.label}>{link.label}</Text>
          <Feather name="chevron-right" size={18} color="#999" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  label: { flex: 1, marginLeft: 10, fontSize: 16 },
});
