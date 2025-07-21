import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Entypo, Feather } from '@expo/vector-icons';
import { TAG_COLORS } from '../../notesConfig';
import { NotesContext } from '../context/NotesContext';

const NoteDetailsScreen = ({ route, navigation }) => {
  const { noteId } = route.params;
  const { notes, deleteNote, togglePin } = useContext(NotesContext);

  const note = notes.find((n) => n.id === noteId);

  if (!note) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#999' }}>Note not found.</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert('Delete Note?', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: () => {
        deleteNote(noteId);
        navigation.goBack();
      }, style: 'destructive' },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{note.title}</Text>
        {note.pinned && <Entypo name="pin" size={20} color="#f39c12" />}
      </View>

      <View style={[styles.tag, { backgroundColor: TAG_COLORS[note.type] }]}>
        <Text style={styles.tagText}>{note.type}</Text>
      </View>

      <Text style={styles.date}>
        Created on {new Date(note.createdAt).toLocaleDateString()}
      </Text>

      <View style={styles.contentBox}>
        <Text style={styles.content}>{note.content}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('NoteModal', { note })}>
          <Feather name="edit" size={18} color="#007AFF" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={handleDelete}>
          <Feather name="trash-2" size={18} color="#FF3B30" />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => togglePin(note.id)}>
          <Feather name={note.pinned ? 'bookmark' : 'bookmark'} size={18} color="#333" />
          <Text style={styles.actionText}>{note.pinned ? 'Unpin' : 'Pin'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fefefe',
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  date: {
    marginTop: 4,
    fontSize: 13,
    color: '#999',
  },
  contentBox: {
    marginTop: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  content: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionText: {
    fontSize: 13,
    marginTop: 4,
    color: '#444',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NoteDetailsScreen;
