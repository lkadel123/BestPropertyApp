// AuditLogsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const mockLogs = [
  {
    id: '1',
    actor: 'Rohit',
    action: 'Updated Lead Status',
    entity: 'Lead #1023',
    timestamp: '2025-06-28 11:20',
  },
  {
    id: '2',
    actor: 'Chandni',
    action: 'Deleted Property',
    entity: 'Property #506',
    timestamp: '2025-06-28 10:55',
  },
  {
    id: '3',
    actor: 'Sourabh',
    action: 'Created New User',
    entity: 'User: Agent A56',
    timestamp: '2025-06-27 16:44',
  },
  // Add more logs as needed
];

export default function AuditLogsScreen() {
  const [searchText, setSearchText] = useState('');

  const filteredLogs = mockLogs.filter(
    (log) =>
      log.actor.toLowerCase().includes(searchText.toLowerCase()) ||
      log.action.toLowerCase().includes(searchText.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.logItem}>
      <View style={styles.iconWrap}>
        <MaterialIcons name="history" size={24} color="#3498db" />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.logText}><Text style={styles.bold}>{item.actor}</Text> {item.action} - <Text style={styles.entity}>{item.entity}</Text></Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>

      <TextInput
        style={styles.search}
        placeholder="Search by user, action or entity..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredLogs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  search: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  logItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 1,
  },
  iconWrap: {
    marginRight: 12,
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  logText: {
    fontSize: 14,
    marginBottom: 4,
  },
  bold: {
    fontWeight: '700',
  },
  entity: {
    fontStyle: 'italic',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
});
