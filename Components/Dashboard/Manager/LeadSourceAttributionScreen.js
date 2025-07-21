import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

// Sample data - replace with API call
const mockLeadSources = [
  { id: '1', source: 'Facebook Ads', count: 120, color: '#2980b9' },
  { id: '2', source: 'Google Ads', count: 85, color: '#e67e22' },
  { id: '3', source: 'Website', count: 60, color: '#27ae60' },
  { id: '4', source: 'Referral', count: 35, color: '#8e44ad' },
  { id: '5', source: 'Walk-in', count: 15, color: '#c0392b' },
];

export default function LeadSourceAttributionScreen() {
  const [leadSources, setLeadSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setLeadSources(mockLeadSources);
      setLoading(false);
    }, 1000);
  }, []);

  const renderSourceItem = ({ item }) => (
    <View style={[styles.sourceCard, { borderLeftColor: item.color }]}>
      <FontAwesome5 name="bullseye" size={20} color={item.color} style={styles.icon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.sourceName}>{item.source}</Text>
        <Text style={styles.leadCount}>{item.count} leads</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎯 Lead Source Attribution</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2980b9" />
      ) : (
        <FlatList
          data={leadSources}
          keyExtractor={(item) => item.id}
          renderItem={renderSourceItem}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fdfdfd',
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  sourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  icon: {
    marginRight: 12,
  },
  sourceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  leadCount: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
  },
});
