import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper';

const mockConversionStats = [
  {
    id: 'A001',
    agentName: 'Sneha Rathi',
    totalLeads: 50,
    contacted: 40,
    interested: 30,
    converted: 18,
  },
  {
    id: 'A002',
    agentName: 'Rahul Meena',
    totalLeads: 35,
    contacted: 28,
    interested: 22,
    converted: 12,
  },
  {
    id: 'A003',
    agentName: 'Vikram Singh',
    totalLeads: 20,
    contacted: 15,
    interested: 8,
    converted: 5,
  },
];

export default function LeadConversionScreen() {
  const [searchText, setSearchText] = useState('');

  const filteredStats = mockConversionStats.filter((a) =>
    a.agentName.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderAgentStats = ({ item }) => {
    const { contacted, interested, converted, totalLeads } = item;
    const conversionRate = ((converted / totalLeads) * 100).toFixed(1);

    return (
      <View style={styles.card}>
        <Text style={styles.agentName}>{item.agentName}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Total Leads:</Text>
          <Text style={styles.value}>{totalLeads}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Contacted:</Text>
          <Text style={styles.value}>{contacted}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Interested:</Text>
          <Text style={styles.value}>{interested}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Converted:</Text>
          <Text style={styles.value}>{converted}</Text>
        </View>

        <View style={styles.progressBox}>
          <Text style={styles.progressLabel}>Conversion Rate: {conversionRate}%</Text>
          <ProgressBar
            progress={converted / totalLeads}
            color="#10b981"
            style={styles.progressBar}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search by agent name..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredStats}
        keyExtractor={(item) => item.id}
        renderItem={renderAgentStats}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    padding: 12,
    fontSize: 14,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 1,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  agentName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    color: '#6b7280',
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  progressBox: {
    marginTop: 12,
  },
  progressLabel: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 4,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#d1d5db',
  },
});
