import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';

import leads from '../../../assets/Data/Leads.json';
import users from '../../../assets/Data/Users.json';

export default function StepAttendees({ formData, updateForm }) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('leads'); // 'leads' | 'users'
  const [filteredList, setFilteredList] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const sourceList = activeTab === 'leads' ? leads : users;
    const results = sourceList.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredList(results);
    setShowAll(false); // Reset to collapsed view on new search or tab
  }, [search, activeTab]);

  const toggleSelect = (id, source) => {
    const exists = formData.attendees.find(
      (a) => a.id === id && a.source === source
    );
    if (exists) {
      updateForm(
        'attendees',
        formData.attendees.filter((a) => !(a.id === id && a.source === source))
      );
    } else {
      const sourceList = source === 'leads' ? leads : users;
      const selected = sourceList.find((i) => i.id === id);
      updateForm('attendees', [
        ...formData.attendees,
        { id, name: selected.name, source },
      ]);
    }
  };

  const isSelected = (id, source) =>
    formData.attendees.some((a) => a.id === id && a.source === source);

  const displayList = showAll ? filteredList : filteredList.slice(0, 3);

  return (
    <View>
      <Text style={styles.sectionTitle}>Select Attendees</Text>

      {/* Toggle Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'leads' && styles.activeTab]}
          onPress={() => setActiveTab('leads')}
        >
          <Text style={activeTab === 'leads' ? styles.activeText : styles.tabText}>
            Leads
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => setActiveTab('users')}
        >
          <Text style={activeTab === 'users' ? styles.activeText : styles.tabText}>
            Users
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder={`Search ${activeTab === 'leads' ? 'Leads' : 'Users'}...`}
        value={search}
        onChangeText={setSearch}
      />

      {/* List */}
      <FlatList
        data={displayList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const selected = isSelected(item.id, activeTab);
          return (
            <TouchableOpacity
              style={[styles.card, selected && styles.selectedCard]}
              onPress={() => toggleSelect(item.id, activeTab)}
            >
              <Image
                source={{ uri: item.imageUrl || item.photo }}
                style={styles.avatar}
              />
              <Text style={styles.cardText}>{item.name}</Text>
              {selected && <Text style={styles.checkmark}>✔</Text>}
            </TouchableOpacity>
          );
        }}
        style={{ maxHeight: 300 }}
      />

      {/* See More / See Less */}
      {filteredList.length > 3 && (
        <TouchableOpacity onPress={() => setShowAll(!showAll)}>
          <Text style={styles.seeMoreText}>
            {showAll ? 'See Less' : `See More (${filteredList.length - 3} more)`}
          </Text>
        </TouchableOpacity>
      )}

      {/* Selected Summary */}
      {formData.attendees.length > 0 && (
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>Selected:</Text>
          {formData.attendees.map((a) => (
            <Text key={`${a.source}-${a.id}`} style={styles.summaryText}>
              • {a.name} ({a.source})
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    borderRadius: 6,
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: '#007aff',
  },
  tabText: {
    color: '#444',
    fontWeight: '500',
  },
  activeText: {
    color: '#fff',
    fontWeight: '600',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedCard: {
    backgroundColor: '#e0f7e9',
    borderColor: '#10b981',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 18,
    marginRight: 12,
  },
  cardText: {
    flex: 1,
    fontSize: 13,
    color: '#333',
  },
  checkmark: {
    fontSize: 13,
    color: '#10b981',
    fontWeight: '700',
  },
  seeMoreText: {
    color: '#007aff',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 10,
  },
  summaryBox: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
  },
  summaryText: {
    fontSize: 13,
    color: '#444',
  },
});
