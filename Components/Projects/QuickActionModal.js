import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const QuickActionModal = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { projectId } = route.params || {};

  const handleClose = () => navigation.goBack();

  const goToAddLead = () => {
    navigation.goBack();
    navigation.navigate('AddLeadsModal', { projectId });
  };

  const goToAssignTask = () => {
    navigation.goBack();
    navigation.navigate('TaskScreen', { projectId });
  };

  const goToProjectFiles = () => {
    navigation.goBack();
    alert('Navigate to project files');
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <View style={styles.container}>
          <Text style={styles.title}>⚡ Quick Actions</Text>

          <TouchableOpacity style={styles.action} onPress={goToAddLead}>
            <Ionicons name="person-add" size={20} color="#007BFF" />
            <Text style={styles.actionText}>Add New Lead</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.action} onPress={goToAssignTask}>
            <MaterialIcons name="assignment" size={20} color="#28A745" />
            <Text style={styles.actionText}>Assign New Task</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.action} onPress={goToProjectFiles}>
            <Ionicons name="folder-open" size={20} color="#FFA500" />
            <Text style={styles.actionText}>Project Files</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
            <Ionicons name="close-circle" size={24} color="#999" />
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 300,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 5,
    position: 'relative',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#2C3E50',
    textAlign: 'center',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  actionText: {
    fontSize: 15,
    color: '#333',
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default QuickActionModal;
