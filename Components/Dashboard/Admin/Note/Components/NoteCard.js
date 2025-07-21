import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, Entypo } from '@expo/vector-icons';
import { TAG_COLORS } from '../notesConfig';

const NoteCard = ({ note, onEdit, onDelete, onTogglePin }) => {
  const {
    title,
    content,
    type,
    pinned,
    createdAt,
  } = note;

  const snippet = content?.replace(/(<([^>]+)>)/gi, '').slice(0, 80) + '...';

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        {pinned && <Entypo name="pin" size={16} color="#f39c12" />}
      </View>

      <Text style={styles.snippet}>{snippet}</Text>

      <View style={styles.footerRow}>
        <View style={[styles.tag, { backgroundColor: TAG_COLORS[type] || '#ccc' }]}>
          <Text style={styles.tagText}>{type}</Text>
        </View>

        <Text style={styles.date}>
          {new Date(createdAt).toLocaleDateString()}
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity onPress={onEdit}>
            <Feather name="edit-2" size={18} color="#007AFF" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete}>
            <Feather name="trash-2" size={18} color="#FF3B30" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onTogglePin}>
            <Feather name={pinned ? 'bookmark' : 'bookmark'} size={18} color="#6c757d" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  snippet: {
    fontSize: 14,
    color: '#666',
    marginVertical: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tag: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  icon: {
    marginHorizontal: 6,
  },
});

export default NoteCard;