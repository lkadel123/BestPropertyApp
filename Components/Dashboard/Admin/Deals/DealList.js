// DealList.js
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const mockDeals = [
  {
    id: 'D001',
    propertyName: 'Skyline Residency',
    buyer: 'Rohit Sharma',
    seller: 'Aarti Properties',
    status: 'Negotiation',
    value: '₹1.5 Cr',
    date: '2025-06-10',
  },
  {
    id: 'D002',
    propertyName: 'Oceanview Villas',
    buyer: 'Sneha Rathi',
    seller: 'UrbanHomes',
    status: 'Finalized',
    value: '₹3.2 Cr',
    date: '2025-06-15',
  },
  {
    id: 'D003',
    propertyName: 'Green Meadows',
    buyer: 'Amit Desai',
    seller: 'Meena Realty',
    status: 'Document Pending',
    value: '₹75 Lakh',
    date: '2025-06-20',
  },
];

export default function DealList({ navigation }) {
  const handleViewDeal = (deal) => {
    Alert.alert('View Deal', `Opening details for ${deal.propertyName}`);
    // navigation.navigate('DealDetail', { dealId: deal.id });
  };

  const handleEditDeal = (deal) => {
    Alert.alert('Edit Deal', `Editing ${deal.propertyName}`);
    // navigation.navigate('EditDeal', { dealId: deal.id });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Finalized':
        return '#27ae60';
      case 'Negotiation':
        return '#f39c12';
      case 'Document Pending':
        return '#e74c3c';
      default:
        return '#7f8c8d';
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mockDeals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.property}>{item.propertyName}</Text>
              <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
                {item.status}
              </Text>
            </View>

            <Text style={styles.detail}>🧑 Buyer: {item.buyer}</Text>
            <Text style={styles.detail}>🏢 Seller: {item.seller}</Text>
            <Text style={styles.detail}>💰 Value: {item.value}</Text>
            <Text style={styles.detail}>📅 Date: {item.date}</Text>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.button} onPress={() => handleViewDeal(item)}>
                <FontAwesome5 name="eye" size={18} color="#2980b9" />
                <Text style={styles.buttonText}>View</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={() => handleEditDeal(item)}>
                <MaterialIcons name="edit" size={20} color="#f39c12" />
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
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
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  property: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
  detail: {
    fontSize: 14,
    marginBottom: 2,
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  buttonText: {
    color: '#333',
    fontSize: 13,
  },
});
