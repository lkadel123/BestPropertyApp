import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

// 🔹 Replace this with API call
const mockUTMLeads = [
  {
    id: '1',
    utm_source: 'facebook',
    utm_medium: 'cpc',
    utm_campaign: 'summer_sale',
    leads: 120,
  },
  {
    id: '2',
    utm_source: 'google',
    utm_medium: 'search',
    utm_campaign: 'property_launch',
    leads: 95,
  },
  {
    id: '3',
    utm_source: 'newsletter',
    utm_medium: 'email',
    utm_campaign: 'july_update',
    leads: 30,
  },
  {
    id: '4',
    utm_source: 'whatsapp',
    utm_medium: 'referral',
    utm_campaign: 'agent_push',
    leads: 55,
  },
];

export default function UTMSourceTrackerScreen() {
  const [utmData, setUtmData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortByLeads, setSortByLeads] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUtmData(mockUTMLeads);
      setLoading(false);
    }, 1000);
  }, []);

  const toggleSort = () => {
    const sorted = [...utmData].sort((a, b) =>
      sortByLeads ? a.id - b.id : b.leads - a.leads
    );
    setUtmData(sorted);
    setSortByLeads(!sortByLeads);
  };

  const totalLeads = utmData.reduce((acc, curr) => acc + curr.leads, 0);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="link-outline" size={20} color="#8e44ad" />
        <Text style={styles.sourceText}>
          {item.utm_source.toUpperCase()} ({item.utm_medium})
        </Text>
      </View>
      <Text style={styles.detail}>📢 Campaign: {item.utm_campaign}</Text>
      <Text style={styles.detail}>📥 Leads: {item.leads}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔗 UTM Source Tracker</Text>

      <View style={styles.summary}>
        <Text style={styles.totalLeads}>Total Leads: {totalLeads}</Text>
        <TouchableOpacity onPress={toggleSort} style={styles.sortButton}>
          <Feather name="filter" size={16} color="#2980b9" />
          <Text style={styles.sortText}>
            Sort by {sortByLeads ? 'Default' : 'Leads'}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#8e44ad" />
      ) : (
        <FlatList
          data={utmData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2c3e50',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLeads: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  sortText: {
    fontSize: 13,
    color: '#2980b9',
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sourceText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#34495e',
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});
