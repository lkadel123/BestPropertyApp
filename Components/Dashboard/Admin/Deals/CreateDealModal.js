import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const dealStages = ['New', 'Negotiation', 'Document Pending', 'Finalized', 'Closed'];

export default function CreateDealModal({ visible, onClose = () => {}, onSubmit }) {
  const [title, setTitle] = useState('');
  const [property, setProperty] = useState('');
  const [client, setClient] = useState('');
  const [amount, setAmount] = useState('');
  const [stage, setStage] = useState('New');
  const [deadline, setDeadline] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const resetForm = () => {
    setTitle('');
    setProperty('');
    setClient('');
    setAmount('');
    setStage('New');
    setDeadline(new Date());
    setNotes('');
  };

  const handleCancel = () => {
    resetForm();
    onClose?.();
  };

  const handleSubmit = () => {
    if (!title || !property || !client || !amount) {
      alert('Please fill all required fields.');
      return;
    }

    const newDeal = {
      id: Date.now().toString(),
      title,
      property,
      client,
      amount,
      stage,
      deadline,
      notes,
    };

    onSubmit?.(newDeal);
    resetForm();
    onClose?.();
  };

  const isFormIncomplete = !title || !property || !client || !amount;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleCancel}>
      <View style={styles.container}>
        {/* ❌ Close Icon */}
        <TouchableOpacity style={styles.closeBtn} onPress={handleCancel}>
          <Ionicons name="close-circle" size={28} color="#c0392b" />
        </TouchableOpacity>

        <Text style={styles.heading}>➕ Create New Deal</Text>

        <TextInput
          placeholder="Deal Title *"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Associated Property *"
          value={property}
          onChangeText={setProperty}
          style={styles.input}
        />
        <TextInput
          placeholder="Client Name *"
          value={client}
          onChangeText={setClient}
          style={styles.input}
        />
        <TextInput
          placeholder="Amount (₹)*"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Stage</Text>
        <View style={styles.pillRow}>
          {dealStages.map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => setStage(s)}
              style={[styles.stagePill, stage === s && styles.activePill]}
            >
              <Text style={{ color: stage === s ? '#fff' : '#555' }}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.dateBtn}
        >
          <Text>📅 Deadline: {deadline.toDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={deadline}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(e, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDeadline(selectedDate);
            }}
          />
        )}

        <TextInput
          placeholder="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          style={[styles.input, { height: 80 }]}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.submitBtn,
              isFormIncomplete && { backgroundColor: '#95a5a6' },
            ]}
            onPress={handleSubmit}
            disabled={isFormIncomplete}
          >
            <Text style={styles.submitText}>Create Deal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  closeBtn: {
    alignSelf: 'flex-end',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  stagePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
  },
  activePill: {
    backgroundColor: '#2980b9',
  },
  dateBtn: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelBtn: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  submitBtn: {
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});


