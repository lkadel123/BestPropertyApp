import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';

const mockSuggestions = [
  {
    id: '1',
    name: 'Ravi Malhotra',
    phone: '+91 9898989898',
    priority: 'High',
    reason: 'Follow-up due today',
    tags: ['Budget Match', '2BHK Interest'],
    lastInteraction: '3 days ago',
  },
  {
    id: '2',
    name: 'Sana Sheikh',
    phone: '+91 9000011111',
    priority: 'Medium',
    reason: 'Site visit completed',
    tags: ['Site Visit Done', 'Waiting for Family Decision'],
    lastInteraction: '5 days ago',
  },
  {
    id: '3',
    name: 'Nikhil Verma',
    phone: '+91 9876543210',
    priority: 'High',
    reason: 'AI flagged - missed call',
    tags: ['Missed Call', 'High Intent'],
    lastInteraction: 'Today',
  },
];

export default function NextCallSuggestionsScreen({ navigation }) {
  const [suggestions, setSuggestions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const fetchSuggestions = () => {
    setLoading(true);
    setTimeout(() => {
      setSuggestions(mockSuggestions);
      setFiltered(mockSuggestions);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    const filteredResults = suggestions.filter((lead) =>
      lead.name.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(filteredResults);
  };

  const handleCallNow = (lead) => {
    navigation.navigate('AutoDialerScreen', { lead });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={[styles.priorityDot, getDotColor(item.priority)]} />
          <Text style={styles.name}>{item.name}</Text>
        </View>
        <Text style={styles.lastSeen}>🕒 {item.lastInteraction}</Text>
      </View>

      <Text style={styles.phone}>{item.phone}</Text>
      <Text style={styles.reason}>📌 {item.reason}</Text>

      {/* Tags */}
      <View style={styles.tagsRow}>
        {item.tags.map((tag) => (
          <View key={tag} style={styles.tagChip}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* Action */}
      <TouchableOpacity style={styles.callBtn} onPress={() => handleCallNow(item)}>
        <Feather name="phone-call" size={18} color="#fff" />
        <Text style={styles.callBtnText}>Call Now</Text>
      </TouchableOpacity>
    </View>
  );

  const getDotColor = (priority) => {
    switch (priority) {
      case 'High':
        return { backgroundColor: '#e74c3c' };
      case 'Medium':
        return { backgroundColor: '#f39c12' };
      case 'Low':
        return { backgroundColor: '#2ecc71' };
      default:
        return { backgroundColor: '#bdc3c7' };
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔮 Next Call Suggestions</Text>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={16} color="#999" />
        <TextInput
          placeholder="Search by name..."
          value={searchText}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
        {searchText ? (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Feather name="x" size={16} color="#999" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Refresh Button */}
      <TouchableOpacity onPress={fetchSuggestions} style={styles.refreshBtn}>
        <Feather name="refresh-ccw" size={16} color="#2980b9" />
        <Text style={styles.refreshText}>Refresh</Text>
      </TouchableOpacity>

      {/* Loader or List */}
      {loading ? (
        <ActivityIndicator size="large" color="#2980b9" style={{ marginTop: 30 }} />
      ) : filtered.length === 0 ? (
        <View style={styles.emptyBox}>
          <MaterialIcons name="auto-awesome" size={40} color="#ccc" />
          <Text style={styles.emptyText}>No suggestions found</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#2c3e50',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    elevation: 1,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  refreshBtn: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  refreshText: {
    fontSize: 13,
    color: '#2980b9',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
  },
  phone: {
    fontSize: 13,
    color: '#666',
    marginVertical: 2,
  },
  reason: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 6,
  },
  lastSeen: {
    fontSize: 12,
    color: '#888',
  },
  priorityDot: {
    width: 10,
    height: 10,
    borderRadius: 50,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  tagChip: {
    backgroundColor: '#ecf0f1',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#555',
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27ae60',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    gap: 8,
  },
  callBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyBox: {
    alignItems: 'center',
    marginTop: 60,
    opacity: 0.7,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 8,
    color: '#888',
  },
});
