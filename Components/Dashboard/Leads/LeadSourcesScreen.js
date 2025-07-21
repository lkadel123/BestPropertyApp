import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
} from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper';

const mockLeadSources = [
  {
    id: 'S001',
    source: 'Facebook Ads',
    totalLeads: 40,
    converted: 14,
    icon: <FontAwesome5 name="facebook" size={18} color="#3b82f6" />,
  },
  {
    id: 'S002',
    source: 'Google Search',
    totalLeads: 50,
    converted: 22,
    icon: <FontAwesome5 name="google" size={18} color="#ef4444" />,
  },
  {
    id: 'S003',
    source: 'Referral',
    totalLeads: 15,
    converted: 9,
    icon: <MaterialIcons name="group" size={18} color="#10b981" />,
  },
  {
    id: 'S004',
    source: 'Walk-in',
    totalLeads: 20,
    converted: 8,
    icon: <MaterialIcons name="store" size={18} color="#f59e0b" />,
  },
  {
    id: 'S005',
    source: 'Website Form',
    totalLeads: 30,
    converted: 12,
    icon: <FontAwesome5 name="globe" size={18} color="#6366f1" />,
  },
];

export default function LeadSourcesScreen() {
  const [search, setSearch] = useState('');

  const filteredSources = mockLeadSources.filter((item) =>
    item.source.toLowerCase().includes(search.toLowerCase())
  );

  const renderSource = ({ item }) => {
    const conversionRate = ((item.converted / item.totalLeads) * 100).toFixed(1);

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>{item.icon}</View>
          <View style={styles.textContainer}>
            <Text style={styles.source}>{item.source}</Text>
            <Text style={styles.meta}>
              {item.converted}/{item.totalLeads} converted ({conversionRate}%)
            </Text>
          </View>
        </View>

        <ProgressBar
          progress={item.converted / item.totalLeads}
          color="#10b981"
          style={styles.progress}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search by source..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredSources}
        keyExtractor={(item) => item.id}
        renderItem={renderSource}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6',
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 16,
    elevation: 1,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  source: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  meta: {
    fontSize: 13,
    color: '#6b7280',
  },
  progress: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
  },
});
