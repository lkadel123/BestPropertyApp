import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';

const StepNotesAttachments = ({ formData, updateForm }) => {
  const [attachments, setAttachments] = useState(formData.attachments || []);

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result?.assets && result.assets.length > 0) {
        const newFile = result.assets[0];
        const updated = [...attachments, newFile];
        setAttachments(updated);
        updateForm('attachments', updated);
      }
    } catch (error) {
      console.log('File pick error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={styles.notesInput}
        placeholder="Add any internal notes..."
        multiline
        numberOfLines={4}
        value={formData.notes}
        onChangeText={(text) => updateForm('notes', text)}
      />

      <Text style={styles.label}>Attachments</Text>
      <TouchableOpacity style={styles.uploadBtn} onPress={handleFilePick}>
        <Ionicons name="attach" size={18} color="#007AFF" />
        <Text style={styles.uploadText}>Upload File</Text>
      </TouchableOpacity>

      {attachments.map((file, index) => (
        <View key={index} style={styles.fileItem}>
          <Ionicons name="document-attach-outline" size={18} color="#555" />
          <Text style={styles.fileName} numberOfLines={1}>
            {file.name || `File ${index + 1}`}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  label: {
    marginTop: 20,
    fontSize: 15,
    fontWeight: '500',
    color: '#444',
    marginBottom: 6,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#e6f0ff',
    borderRadius: 8,
    marginTop: 8,
    width: '50%',
  },
  uploadText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#007AFF',
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  fileName: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
});

export default StepNotesAttachments;
