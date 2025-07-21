import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function LeadCard({
  lead = {},
  index = 0,
  total = 0,
  onSearch = () => {},
  onCall = () => {},
  isCalling = false,
  hasPermission = true,
}) {
  const { name, phone, imageUrl } = lead;

  const displayName = name || 'Unknown';
  const displayPhone = phone || 'N/A';

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Lead {index + 1} of {total}</Text>
        <TouchableOpacity onPress={onSearch} style={styles.searchButton} accessibilityLabel="Search Leads">
          <Feather name="search" size={20} color="#2980b9" />
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <Image
        source={{ uri: lead.imageUrl }}
        style={styles.avatar}
        resizeMode="cover"
      />

      {/* Lead Info */}
      <Text style={styles.name}>{displayName}</Text>
      <Text style={styles.phone}>{displayPhone}</Text>

      {/* Call Button */}
      <TouchableOpacity
        style={[styles.callButton, (isCalling || !hasPermission) && styles.disabled]}
        onPress={onCall}
        disabled={isCalling || !hasPermission}
        accessibilityLabel="Call Lead"
      >
        <Feather name="phone-call" size={16} color="#fff" />
        <Text style={styles.callText}>
          {isCalling ? 'Calling...' : 'Call Now'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  searchButton: {
    padding: 6,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  callText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  disabled: {
    backgroundColor: '#b2bec3',
  },
});


