import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { loadReports, saveReports } from '../utils/ReportStorage';

export default function ReportsScreen() {
  const [myReports, setMyReports] = useState([]);
  const [teamReports, setTeamReports] = useState([
    {
      id: 'T001',
      name: 'Priya Sharma',
      title: 'Weekly Site Visits',
      date: '2025-07-10',
    },
    {
      id: 'T002',
      name: 'Rohit Mehta',
      title: 'Client Meeting Summary',
      date: '2025-07-09',
    },
  ]);
  const [search, setSearch] = useState('');
  const [previewData, setPreviewData] = useState([]);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    remarks: '',
    submitTo: '',
    fileUri: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [status, setStatus] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
      });

      if (result?.assets?.length) {
        const file = result.assets[0];
        const fileUri = file.uri;
        const b64 = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const wb = XLSX.read(b64, { type: 'base64' });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });

        setForm((prev) => ({ ...prev, fileUri }));
        setPreviewData(jsonData.slice(0, 5));
        Alert.alert('Upload Successful', `You attached: ${file.name}`);
      }
    } catch (error) {
      Alert.alert('Upload Failed', error.message);
    }
  };

  const handleSubmitReport = () => {
    const newReport = {
      id: `R-${Date.now()}`,
      ...form,
      date: moment().format('YYYY-MM-DD'),
      status: 'Pending for Approval',
      feedback: '',
    };
    setMyReports((prev) => [newReport, ...prev]);
    setForm({ title: '', description: '', remarks: '', submitTo: '', fileUri: '' });
    setPreviewData([]);
    setFormModalVisible(false);
    Alert.alert('Success', 'Report submitted!');
  };

  useEffect(() => {
  const fetchReports = async () => {
    const storedReports = await loadReports();
    setMyReports(storedReports);
  };
  fetchReports();
}, []);

useEffect(() => {
  saveReports(myReports);
}, [myReports]);

  const handleDownload = async (fileUri) => {
    if (await Sharing.isAvailableAsync()) {
      Sharing.shareAsync(fileUri);
    } else {
      Alert.alert('Error', 'Sharing is not available on this device.');
    }
  };

  const handleStatusUpdate = () => {
    setMyReports((prev) =>
      prev.map((r) =>
        r.id === selectedReport.id
          ? { ...r, status, feedback: status === 'Not Approved' ? feedback : '' }
          : r
      )
    );
    setModalVisible(false);
  };

  const filteredReports = myReports.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>🔍 Search My Reports</Text>
        <TextInput
          placeholder="Search by title..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          placeholderTextColor="#6b7280"
        />

        <Text style={styles.sectionTitle}>🧍‍♂️ My Reports</Text>
        {filteredReports.length === 0 ? (
          <Text style={styles.emptyText}>No matching reports.</Text>
        ) : (
          filteredReports.map((report) => (
            <TouchableOpacity
              key={report.id}
              style={styles.reportCard}
              onPress={() => {
                setSelectedReport(report);
                setStatus(report.status);
                setFeedback(report.feedback || '');
                setModalVisible(true);
              }}
            >
              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.reportDate}>{report.date}</Text>
              <Text style={styles.reportAuthor}>To {report.submitTo}</Text>
              <Text style={{ color: '#059669' }}>Status: {report.status}</Text>
              {report.feedback ? (
                <Text style={{ color: '#b91c1c' }}>Feedback: {report.feedback}</Text>
              ) : null}
              {report.fileUri && (
                <TouchableOpacity
                  style={styles.downloadBtn}
                  onPress={() => handleDownload(report.fileUri)}
                >
                  <Ionicons name="download-outline" size={18} color="#2563eb" />
                  <Text style={styles.downloadText}>Download</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))
        )}

        <Text style={styles.sectionTitle}>👥 Team Reports</Text>
        {teamReports.map((report) => (
          <View key={report.id} style={styles.reportCard}>
            <Text style={styles.reportTitle}>{report.title}</Text>
            <Text style={styles.reportDate}>{report.date}</Text>
            <Text style={styles.reportAuthor}>By {report.name}</Text>
          </View>
        ))}
      </ScrollView>

      {/* ➕ Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setFormModalVisible(true)}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* 📄 Submit Report Modal */}
      <Modal visible={formModalVisible} animationType="slide" onRequestClose={() => setFormModalVisible(false)}>
        <ScrollView style={styles.modalContent}>
          <Text style={styles.sectionTitle}>📝 Submit New Report</Text>
          <TextInput
            style={styles.input}
            placeholder="Report Title"
            value={form.title}
            onChangeText={(val) => setForm({ ...form, title: val })}
            placeholderTextColor="#6b7280"
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={form.description}
            onChangeText={(val) => setForm({ ...form, description: val })}
            placeholderTextColor="#6b7280"
          />
          <TextInput
            style={styles.input}
            placeholder="Remarks"
            value={form.remarks}
            onChangeText={(val) => setForm({ ...form, remarks: val })}
            placeholderTextColor="#6b7280"
          />
          <TextInput
            style={styles.input}
            placeholder="Submit To"
            value={form.submitTo}
            onChangeText={(val) => setForm({ ...form, submitTo: val })}
            placeholderTextColor="#6b7280"
          />
          <TouchableOpacity style={styles.uploadBtn} onPress={handleFileUpload}>
            <Ionicons name="attach-outline" size={20} color="#fff" />
            <Text style={styles.uploadText}>Attach File</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.uploadBtn, { backgroundColor: '#16a34a' }]}
            onPress={handleSubmitReport}
          >
            <Ionicons name="send-outline" size={20} color="#fff" />
            <Text style={styles.uploadText}>Submit Report</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.uploadBtn, { backgroundColor: '#ef4444', marginTop: 10 }]}
            onPress={() => setFormModalVisible(false)}
          >
            <Text style={styles.uploadText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>

      {/* 📋 Report Detail Modal */}
      {selectedReport && (
        <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.sectionTitle}>{selectedReport.title}</Text>
            <Text>Description: {selectedReport.description}</Text>
            <Text>Remarks: {selectedReport.remarks}</Text>
            <Text>Submitted To: {selectedReport.submitTo}</Text>
            <Text>Date: {selectedReport.date}</Text>
            <Text>Status: {selectedReport.status}</Text>
            {selectedReport.feedback ? (
              <Text>Feedback: {selectedReport.feedback}</Text>
            ) : null}

            <Text style={styles.sectionTitle}>🧾 Update Status</Text>
            <TextInput
              placeholder="New Status (Received, Approved, Not Approved)"
              style={styles.input}
              value={status}
              onChangeText={setStatus}
              placeholderTextColor="#6b7280"
            />
            {status === 'Not Approved' && (
              <TextInput
                placeholder="Feedback"
                style={styles.input}
                value={feedback}
                onChangeText={setFeedback}
                placeholderTextColor="#6b7280"
              />
            )}
            <TouchableOpacity style={styles.uploadBtn} onPress={handleStatusUpdate}>
              <Text style={styles.uploadText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.uploadBtn, { backgroundColor: '#ef4444', marginTop: 10 }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.uploadText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f9fafb' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginVertical: 12 },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
  },
  reportCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  reportTitle: { fontSize: 16, fontWeight: '500' },
  reportDate: { fontSize: 12, color: '#6b7280' },
  reportAuthor: { fontSize: 13, color: '#4b5563' },
  downloadBtn: {
    flexDirection: 'row',
    marginTop: 6,
    alignItems: 'center',
  },
  downloadText: { marginLeft: 6, color: '#2563eb', fontSize: 14 },
  uploadBtn: {
    flexDirection: 'row',
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  uploadText: { color: '#fff', marginLeft: 8, fontSize: 15, fontWeight: '500' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
  },
  modalContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fefefe',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 14,
    fontStyle: 'italic',
    paddingLeft: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#2563eb',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
    zIndex: 10,
  },
});
