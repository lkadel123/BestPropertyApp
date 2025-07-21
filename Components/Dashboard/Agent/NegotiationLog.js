import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons';

const LOG_TYPES = ['Price Discussion', 'Objection', 'File Shared'];

const typeColors = {
  'Price Discussion': '#f39c12',
  Objection: '#e74c3c',
  'File Shared': '#3498db',
};

function formatDate(dateString) {
  const today = new Date();
  const date = new Date(dateString);
  const diff = today - date;
  const oneDay = 24 * 60 * 60 * 1000;

  if (diff < oneDay && date.getDate() === today.getDate()) return 'Today';
  if (diff < 2 * oneDay && date.getDate() === today.getDate() - 1) return 'Yesterday';
  return date.toDateString();
}

export default function NegotiationLog() {
  const [logs, setLogs] = useState([
    {
      id: '1',
      type: 'Price Discussion',
      detail: 'Client requested a 5% discount on the final amount.',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'Objection',
      detail: 'Concerned about project delivery timelines.',
      timestamp: new Date().toISOString(),
    },
  ]);

  const [input, setInput] = useState('');
  const [logType, setLogType] = useState('Price Discussion');
  const [filter, setFilter] = useState('All');

  const addLog = () => {
    if (!input.trim()) return;

    const newLog = {
      id: Date.now().toString(),
      type: logType,
      detail: input,
      timestamp: new Date().toISOString(),
    };

    setLogs([newLog, ...logs]);
    setInput('');
  };

  const deleteLog = (id) => {
    Alert.alert('Delete Log', 'Are you sure you want to delete this log?', [
      { text: 'Cancel' },
      { text: 'Delete', onPress: () => setLogs(logs.filter((log) => log.id !== id)) },
    ]);
  };

  const groupedLogs = logs.reduce((acc, log) => {
    const group = formatDate(log.timestamp);
    if (!acc[group]) acc[group] = [];
    acc[group].push(log);
    return acc;
  }, {});

  const filteredLogs = Object.entries(groupedLogs).map(([date, logs]) => ({
    date,
    logs: logs.filter((l) => filter === 'All' || l.type === filter),
  }));

  return (
    <View style={styles.container}>

      {/* Filter Buttons */}
      <View style={styles.filterRow}>
        {['All', ...LOG_TYPES].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.filterBtn, filter === type && styles.activeFilter]}
            onPress={() => setFilter(type)}
          >
            <Text
              style={[
                styles.filterText,
                filter === type && styles.activeFilterText,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Input Card */}
      <View style={styles.inputCard}>
        <Text style={styles.inputLabel}>Log Type</Text>
        <View style={styles.typeSelector}>
          {LOG_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                logType === type && styles.activeTypeButton,
              ]}
              onPress={() => setLogType(type)}
            >
              <Text
                style={[
                  styles.typeText,
                  logType === type && styles.activeTypeText,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.textInput}
          placeholder="Write log detail..."
          value={input}
          onChangeText={setInput}
          multiline
        />

        {/* Upload Placeholder */}
        {logType === 'File Shared' && (
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => Alert.alert('File Picker', 'File picker coming soon')}
          >
            <FontAwesome5 name="file-upload" size={18} color="#2980b9" />
            <Text style={styles.uploadText}>Upload File (Placeholder)</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.addButton} onPress={addLog}>
          <Feather name="plus-circle" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Log</Text>
        </TouchableOpacity>
      </View>

      {/* Log List */}
      <FlatList
        data={filteredLogs}
        keyExtractor={(item) => item.date}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.groupDate}>{item.date}</Text>
            {item.logs.length === 0 ? (
              <Text style={styles.emptyText}>No logs of this type.</Text>
            ) : (
              item.logs.map((log) => (
                <TouchableOpacity
                  key={log.id}
                  style={styles.logCard}
                  onLongPress={() => deleteLog(log.id)}
                >
                  <View style={styles.logHeader}>
                    <View
                      style={[
                        styles.typeChip,
                        { backgroundColor: typeColors[log.type] || '#ccc' },
                      ]}
                    >
                      <Text style={styles.chipText}>{log.type}</Text>
                    </View>
                    <Text style={styles.timestamp}>
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </Text>
                  </View>
                  <Text style={styles.logDetail}>{log.detail}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4f6f8',
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  filterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#ecf0f1',
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 6,
  },
  activeFilter: {
    backgroundColor: '#2980b9',
  },
  filterText: {
    fontSize: 13,
    color: '#555',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '600',
  },
  inputCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  typeButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#ecf0f1',
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 6,
  },
  activeTypeButton: {
    backgroundColor: '#3498db',
  },
  typeText: {
    fontSize: 13,
    color: '#555',
  },
  activeTypeText: {
    color: '#fff',
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#fafafa',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    marginBottom: 10,
    minHeight: 60,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadText: {
    marginLeft: 8,
    color: '#2980b9',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27ae60',
    padding: 10,
    borderRadius: 6,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  groupDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 4,
  },
  logCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    alignItems: 'center',
  },
  typeChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  chipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  logDetail: {
    fontSize: 14,
    color: '#444',
  },
  emptyText: {
    fontSize: 13,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 10,
    paddingLeft: 8,
  },
});
