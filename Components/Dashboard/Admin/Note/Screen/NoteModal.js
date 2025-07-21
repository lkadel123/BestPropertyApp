import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import RichTextEditor from '../Components/RichTextEditor';// ✅ Ensure it's default-exported
import { NOTE_TYPES } from '../notesConfig';

const NoteModal = ({ visible, onClose, onSave, editingNote }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState(NOTE_TYPES[0]);

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title || '');
      setContent(editingNote.content || '');
      setType(editingNote.type || NOTE_TYPES[0]);
    } else {
      setTitle('');
      setContent('');
      setType(NOTE_TYPES[0]);
    }
  }, [editingNote, visible]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a note title.');
      return;
    }

    const newNote = {
      id: editingNote?.id || Date.now().toString(),
      title,
      content,
      type,
      pinned: editingNote?.pinned || false,
      createdAt: editingNote?.createdAt || new Date().toISOString(),
    };

    onSave(newNote);
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.heading}>
              {editingNote ? '✏️ Edit Note' : '📝 New Note'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <AntDesign name="closecircleo" size={22} color="#888" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter note title"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>Type</Text>
          <View style={styles.typeRow}>
            {NOTE_TYPES.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.typeBtn,
                  type === item && styles.activeType,
                ]}
                onPress={() => setType(item)}
              >
                <Text
                  style={[
                    styles.typeText,
                    type === item && styles.activeTypeText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Details</Text>
          <RichTextEditor value={content} onChange={setContent} />

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveText}>
                {editingNote ? 'Update Note' : 'Save Note'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    marginTop: 12,
    fontWeight: '500',
    color: '#555',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 15,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  typeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    marginBottom: 8,
  },
  typeText: {
    fontSize: 13,
    color: '#333',
  },
  activeType: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  activeTypeText: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  cancelText: {
    color: '#999',
    fontSize: 15,
  },
  saveBtn: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default NoteModal;

