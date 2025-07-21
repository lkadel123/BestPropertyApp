import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { NOTE_TYPES, TAG_COLORS } from '../notesConfig';

const NoteTagFilter = ({ selectedType, onSelect, noteCounts = {} }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity
        style={[
          styles.tag,
          selectedType === 'All' && styles.activeTag,
          { backgroundColor: selectedType === 'All' ? '#007AFF' : '#eee' },
        ]}
        onPress={() => onSelect('All')}
      >
        <Text style={[styles.text, selectedType === 'All' && styles.activeText]}>
          All {noteCounts.All ? `(${noteCounts.All})` : ''}
        </Text>
      </TouchableOpacity>

      {NOTE_TYPES.map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.tag,
            selectedType === type && styles.activeTag,
            { backgroundColor: selectedType === type ? TAG_COLORS[type] : '#eee' },
          ]}
          onPress={() => onSelect(type)}
        >
          <Text style={[styles.text, selectedType === type && styles.activeText]}>
            {type} {noteCounts[type] ? `(${noteCounts[type]})` : ''}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
  activeTag: {
    backgroundColor: '#007AFF',
  },
  activeText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default NoteTagFilter;