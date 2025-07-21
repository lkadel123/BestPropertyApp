import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

// Components
import NoteCard from '../Components/NoteCard';
import NoteTagFilter from '../Components/NoteTagFilter';
import NoteModal from './NoteModal'; // ✅ Correct default import

// Context
import { NotesContext } from '../context/NotesContext';
import { NOTE_TYPES } from '../notesConfig';

export default function NotesDashboard() {
  const { notes, addNote, updateNote, deleteNote, togglePin } = useContext(NotesContext);

  const [selectedType, setSelectedType] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const openModal = (note = null) => {
    setEditingNote(note);
    setModalVisible(true);
  };

  const handleSave = (noteData) => {
    if (editingNote) {
      updateNote(editingNote.id, noteData);
    } else {
      addNote(noteData);
    }
    setModalVisible(false);
    setEditingNote(null);
  };

  const handleDelete = (id) => deleteNote(id);
  const handleTogglePin = (id) => togglePin(id);

  const filteredNotes =
    selectedType === 'All'
      ? notes
      : notes.filter((note) => note.type === selectedType);

  const getNoteCounts = () => {
    const counts = { All: notes.length };
    NOTE_TYPES.forEach((type) => {
      counts[type] = notes.filter((note) => note.type === type).length;
    });
    return counts;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.heading}>🗒️ Notes</Text>

        <NoteTagFilter
          selectedType={selectedType}
          onSelect={setSelectedType}
          noteCounts={getNoteCounts()} // ✅ optional note count
        />

        <FlatList
          data={filteredNotes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              onEdit={() => openModal(item)}
              onDelete={() => handleDelete(item.id)}
              onTogglePin={() => handleTogglePin(item.id)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />

        <TouchableOpacity style={styles.fab} onPress={() => openModal()}>
          <AntDesign name="plus" size={24} color="#fff" />
        </TouchableOpacity>

        <NoteModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setEditingNote(null);
          }}
          onSave={handleSave}
          editingNote={editingNote}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
    color: '#222',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});


