import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

// Mock team member list — replace with real API
const mockTeamMembers = [
  { id: 'u1', name: 'Priya Sharma', role: 'Sales Executive' },
  { id: 'u2', name: 'Amit Verma', role: 'Telecaller' },
  { id: 'u3', name: 'Ravi Kapoor', role: 'Relationship Manager' },
  { id: 'u4', name: 'Neha Sinha', role: 'Site Visit Coordinator' },
];

const ReassignTeamScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { projectId } = route.params;

  const [selected, setSelected] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredList, setFilteredList] = useState(mockTeamMembers);

  useEffect(() => {
    // Optionally fetch team members via API
    setFilteredList(mockTeamMembers);
  }, []);

  const toggleSelection = (userId) => {
    setSelected((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSave = async () => {
    // await assignTeamToProject(projectId, selected);
    Alert.alert('✅ Team Updated', 'Assigned team members to the project.');
    navigation.goBack();
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const lower = text.toLowerCase();
    const filtered = mockTeamMembers.filter((member) =>
      member.name.toLowerCase().includes(lower)
    );
    setFilteredList(filtered);
  };

  const renderItem = ({ item }) => {
    const isSelected = selected.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => toggleSelection(item.id)}
      >
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.role}>{item.role}</Text>
        </View>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color="#007BFF" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🔁 Reassign Team for Project #{projectId}</Text>

      <TextInput
        placeholder="Search team members..."
        style={styles.searchInput}
        value={searchText}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={<Text style={styles.emptyText}>No members found</Text>}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>💾 Save Assignment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#2C3E50',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#F7F9FC',
    marginBottom: 10,
  },
  cardSelected: {
    borderColor: '#007BFF',
    backgroundColor: '#E6F0FF',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
  },
  role: {
    fontSize: 13,
    color: '#666',
  },
  saveBtn: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 30,
    fontSize: 14,
  },
});

export default ReassignTeamScreen;
