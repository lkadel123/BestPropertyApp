import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const mockCampaignInsights = [
  {
    id: '1',
    campaign: 'Summer Sale 2025',
    impressions: 10000,
    clicks: 1500,
    leads: 300,
    bookings: 25,
  },
  {
    id: '2',
    campaign: 'Facebook Remarketing',
    impressions: 8000,
    clicks: 1200,
    leads: 220,
    bookings: 18,
  },
  {
    id: '3',
    campaign: 'Google PPC Campaign',
    impressions: 15000,
    clicks: 2100,
    leads: 450,
    bookings: 36,
  },
];

export default function CampaignPerformanceInsightsScreen() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setInsights(mockCampaignInsights);
      setLoading(false);
    }, 1000);
  }, []);

  const renderInsightItem = ({ item }) => {
    const ctr = ((item.clicks / item.impressions) * 100).toFixed(2);
    const conversionRate = ((item.leads / item.clicks) * 100).toFixed(2);
    const bookingRate = ((item.bookings / item.leads) * 100).toFixed(2);

    return (
      <View style={styles.insightCard}>
        <View style={styles.headerRow}>
          <MaterialIcons name="insights" size={20} color="#2980b9" />
          <Text style={styles.campaignName}>{item.campaign}</Text>
        </View>
        <Text style={styles.stat}>👁️ Impressions: {item.impressions}</Text>
        <Text style={styles.stat}>🖱️ Clicks: {item.clicks} (CTR: {ctr}%)</Text>
        <Text style={styles.stat}>📥 Leads: {item.leads} (Conv: {conversionRate}%)</Text>
        <Text style={styles.stat}>📞 Bookings: {item.bookings} (Booking Rate: {bookingRate}%)</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Campaign Performance Insights</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#2980b9" />
      ) : (
        <FlatList
          data={insights}
          keyExtractor={(item) => item.id}
          renderItem={renderInsightItem}
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
    marginBottom: 20,
    color: '#2c3e50',
  },
  insightCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  campaignName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginLeft: 8,
  },
  stat: {
    fontSize: 14,
    color: '#555',
    marginVertical: 2,
  },
});
