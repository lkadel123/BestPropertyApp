import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

import StepBasicInfo from '../../Components/Meetings/MeetinfFormSteps/StepBasicInfo';
import StepDateTime from '../../Components/Meetings/MeetinfFormSteps/StepDateTime';
import StepLocation from '../../Components/Meetings/MeetinfFormSteps/StepLocation';
import StepAttendees from '../../Components/Meetings/MeetinfFormSteps/StepAttendees';
import StepNotesAttachments from '../../Components/Meetings/MeetinfFormSteps/StepNotesAttachments';
import { saveMeeting } from '../../utils/meetingStorage';

export default function MeetingModal() {
  const navigation = useNavigation();
  const route = useRoute();
  const { lead } = route.params || {};

  const [formData, setFormData] = useState({
    title: '',
    property: '',
    datetime: '',
    locationType: 'onsite',
    locationValue: '',
    attendees: [],
    notes: '',
    attachments: [],
  });

  useEffect(() => {
    if (lead && lead.name) {
      setFormData(prev => ({
        ...prev,
        title: `Meeting with ${lead.name}`,
        attendees: [lead],
        property: lead.property || '',
      }));
    }
  }, [lead]);

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

const handleSave = async () => {
  if (!formData.title.trim() || !formData.datetime) {
    Alert.alert('Missing Info', 'Please fill in required fields before saving.');
    return;
  }

  const meetingData = {
    id: Date.now().toString(),
    ...formData,
    type: 'meeting',
    date: formData.datetime,
  };

  await saveMeeting(meetingData);
  Alert.alert('Success', 'Meeting saved successfully.');
  navigation.goBack();
};

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📝 Create New Meeting</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.close}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Form Body */}
      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <StepBasicInfo formData={formData} updateForm={updateForm} />
        <StepDateTime formData={formData} updateForm={updateForm} />
        <StepLocation formData={formData} updateForm={updateForm} />
        <StepAttendees formData={formData} updateForm={updateForm} />
        <StepNotesAttachments formData={formData} updateForm={updateForm} />
      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>✅ Save Meeting</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  header: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  close: {
    fontSize: 22,
    color: '#999',
  },
  body: {
    padding: 16,
    paddingBottom: 160, // ensures it doesn't clash with footer
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: '#fff',
    borderTopColor: '#eee',
    borderTopWidth: 1,
    zIndex: 10,
  },
  saveBtn: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 70,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});


