import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

const NoteModal = ({ route, navigation }) => {
  const { leadId, leadName } = route.params;

  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [document, setDocument] = useState(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (result.type === 'success') {
        setDocument(result);
      }
    } catch (err) {
      console.error('Document pick error:', err);
    }
  };

  const handleSubmit = () => {
    if (!title || !detail) {
      Alert.alert('Missing Fields', 'Please fill out title and detail.');
      return;
    }

    const noteData = {
      leadId,
      title,
      detail,
      document,
      createdAt: new Date().toISOString(),
    };

    console.log('Note Submitted:', noteData);
    // Save to storage or backend here
    navigation.goBack();
  };

  return (
    <Modal animationType="slide" transparent visible>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.heading}>Add Note for {leadName || leadId}</Text>

          <TextInput
            style={styles.input}
            placeholder="Note Title"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Note Detail"
            value={detail}
            onChangeText={setDetail}
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity style={styles.attachButton} onPress={pickDocument}>
            <Text style={styles.attachText}>
              {document ? `📎 ${document.name}` : 'Attach Document'}
            </Text>
          </TouchableOpacity>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NoteModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: Dimensions.get('window').width * 0.88,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 14,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  textarea: {
    height: 80,
    textAlignVertical: 'top',
  },
  attachButton: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  attachText: {
    color: '#111827',
    fontSize: 13,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
  },
  cancelText: {
    color: '#111827',
    fontWeight: '600',
  },
});

