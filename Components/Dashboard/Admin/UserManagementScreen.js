import React, { useState, useMemo, useEffect, useLayoutEffect,useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Button,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';

export default function UserManagementScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [taskUser, setTaskUser] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [taskDeadline, setTaskDeadline] = useState(new Date());
  const [taskText, setTaskText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    role: '',
    status: '',
  });

  const navigation = useNavigation();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://bestpropertiesmohali.com/api/AdminUsers/list/', {
        method: 'GET',
        headers: {
          Authorization: `Bearer 9j1h8hgjO0KUin2bhj58d97jiOh67f5h48hj78hg8vg5j63fo0h930`,
          'Content-Type': 'application/json',
        },
      });

      const text = await response.text();
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      let json;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error('Invalid JSON response');
      }

      let userArray = [];
      if (Array.isArray(json)) {
        userArray = json;
      } else if (json && typeof json === 'object') {
        userArray = json.data || json.users || json.results || [];
        if (!Array.isArray(userArray)) {
          userArray = [];
        }
      }

      const mappedUsers = userArray.map((user, index) => ({
        id: user.id?.toString() || `${index}`,
        name: user.fullName || user.name || 'Unnamed',
        role: user.role || 'Unknown',
        phone: user.phone || '',
        status: user.status || 'Active',
        email: user.email || 'N/A',
        location: user.address || user.location || 'N/A',
        photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.name || 'Unnamed')}&background=random`,
      }));

      setUsers(mappedUsers);
    } catch (error) {
      console.error('Fetch Error:', error.message);
      Alert.alert('Error', 'Failed to fetch user list');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Load on first render
  useEffect(() => {
    fetchUsers();
  }, []);

  // Refresh on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('AddMemberModal')}
          style={styles.headerButton}
          activeOpacity={0.7}
        >
          <Ionicons name="person-add" size={20} color="#fff" />
          <Text style={styles.headerButtonText}>Add</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          (u.name || '').toLowerCase().includes(searchText.toLowerCase()) ||
          (u.role || '').toLowerCase().includes(searchText.toLowerCase())
      ),
    [users, searchText]
  );

  const handleCall = async (phoneNumber) => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Phone number not available');
      return;
    }
    const url = `tel:${phoneNumber}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to make a call on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to initiate call');
    }
  };

  const handleMessage = async (phone) => {
    if (!phone) {
      Alert.alert('Error', 'Phone number not available');
      return;
    }
    const url = `sms:${phone}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Unable to send message on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to initiate message');
    }
  };

  const handleSendNotification = (user) => {
    if (!user?.name) {
      Alert.alert('Error', 'User name not available');
      return;
    }
    Alert.alert('Notification Sent', `Notification sent to ${user.name}`);
  };

  const handleAssignTask = () => {
    if (!taskText.trim()) {
      Alert.alert('Error', 'Task description cannot be empty');
      return;
    }
    if (!taskUser?.name) {
      Alert.alert('Error', 'User name not available');
      return;
    }
    Alert.alert(
      '✅ Task Assigned',
      `${taskUser.name}:\n${taskText}\nDeadline: ${taskDeadline.toDateString()}`
    );
    setTaskUser(null);
    setTaskText('');
    setTaskDeadline(new Date());
    setShowDatePicker(false);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser?.id) {
      Alert.alert('Error', 'No user selected for update');
      return;
    }

    try {
      const response = await fetch(`https://bestpropertiesmohali.com/api/AdminUsers/update/${selectedUser.id}/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer 9j1h8hgjO0KUin2bhj58d97jiOh67f5h48hj78hg8vg5j63fo0h930`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: editForm.fullName,
          email: editForm.email,
          phone: editForm.phone,
          address: editForm.address,
          role: editForm.role,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedUser = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                name: updatedUser.fullName || user.name,
                email: updatedUser.email || user.email,
                phone: updatedUser.phone || user.phone,
                location: updatedUser.address || user.location,
                role: updatedUser.role || user.role,
              }
            : user
        )
      );
      Alert.alert('Success', 'User updated successfully');
      navigation.goBack();
      setIsEditing(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Update Error:', error.message);
      Alert.alert('Error', 'Failed to update user');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser?.id) {
      Alert.alert('Error', 'No user selected for deletion');
      return;
    }

    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete ${selectedUser.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`https://bestpropertiesmohali.com/api/AdminUsers/delete/${selectedUser.id}/`, {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer 9j1h8hgjO0KUin2bhj58d97jiOh67f5h48hj78hg8vg5j63fo0h930`,
                  'Content-Type': 'application/json',
                },
              });

              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }

              setUsers((prevUsers) => prevUsers.filter((user) => user.id !== selectedUser.id));
              Alert.alert('Success', 'User deleted successfully');
              setSelectedUser(null);
            } catch (error) {
              console.error('Delete Error:', error.message);
              Alert.alert('Error', 'Failed to delete user');
            }
          },
        },
      ]
    );
  };

  const openUserDetail = (user) => {
    setSelectedUser(user);
    setEditForm({
      fullName: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.location || '',
      role: user.role || '',
      status: user.status || 'Active',
    });
  };

  const closeUserDetail = () => {
    setSelectedUser(null);
    setIsEditing(false);
  };

  const openTaskModal = (user) => {
    setTaskUser(user);
  };

  const closeTaskModal = () => {
    setTaskUser(null);
    setTaskText('');
    setTaskDeadline(new Date());
    setShowDatePicker(false);
  };

  const getInitials = (name = '') => {
    return (
      name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'UN'
    );
  };

  const statusOptions = ['Pending', 'Active', 'Not Verified', 'Deactivated'];

  const UserCard = ({ item }) => {
    return (
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() => openUserDetail(item)}
          style={styles.userInfo}
          accessibilityLabel={`View details for ${item.name || 'user'}`}
          accessibilityHint="Tap to view detailed information about this user"
          activeOpacity={0.7}
        >
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: item.photo }}
              style={styles.avatar}
              defaultSource={{ uri: 'https://via.placeholder.com/48' }}
            />
            <Text style={styles.initials}>{getInitials(item.name)}</Text>
          </View>
          <View style={styles.userText}>
            <Text style={styles.name}>{item.name || 'Unnamed'}</Text>
            <Text style={styles.role}>{item.role || 'Unknown'}</Text>
            <Text
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    item.status === 'Active'
                      ? '#10b981'
                      : item.status === 'Pending'
                      ? '#f59e0b'
                      : item.status === 'Not Verified'
                      ? '#3b82f6'
                      : '#ef4444',
                },
              ]}
            >
              {item.status}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.taskButton]}
            onPress={() => openTaskModal(item)}
            accessibilityLabel={`Assign task to ${item.name || 'user'}`}
            accessibilityHint="Open task assignment for this user"
            activeOpacity={0.7}
          >
            <Ionicons name="clipboard-outline" size={20} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleCall(item.phone)}
            accessibilityLabel={`Call ${item.name || 'user'}`}
            accessibilityHint="Initiate a phone call to this user"
            activeOpacity={0.7}
          >
            <Ionicons name="call" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search by name or role"
        placeholderTextColor="#9ca3af"
        value={searchText}
        onChangeText={setSearchText}
        accessibilityLabel="Search users by name or role"
        accessibilityHint="Enter a name or role to filter the user list"
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        initialNumToRender={10}
        renderItem={({ item }) => <UserCard item={item} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Detail Modal */}
      <Modal visible={!!selectedUser} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.detailCard}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeUserDetail}
              accessibilityLabel="Close user details"
              accessibilityHint="Close the user details modal"
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={28} color="#ef4444" />
            </TouchableOpacity>
            {selectedUser && (
              <>
                <View style={styles.avatarContainer}>
                  <Image
                    source={{ uri: selectedUser.photo }}
                    style={styles.largeAvatar}
                    defaultSource={{ uri: 'https://via.placeholder.com/100' }}
                  />
                  <Text style={styles.initialsLarge}>{getInitials(selectedUser.name)}</Text>
                </View>
                {isEditing ? (
                  <>
                    <TextInput
                      style={styles.input}
                      placeholder="Full Name"
                      value={editForm.fullName}
                      onChangeText={(text) => setEditForm({ ...editForm, fullName: text })}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      value={editForm.email}
                      onChangeText={(text) => setEditForm({ ...editForm, email: text })}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Phone"
                      value={editForm.phone}
                      onChangeText={(text) => setEditForm({ ...editForm, phone: text })}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Address"
                      value={editForm.address}
                      onChangeText={(text) => setEditForm({ ...editForm, address: text })}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Role"
                      value={editForm.role}
                      onChangeText={(text) => setEditForm({ ...editForm, role: text })}
                    />
                    <Picker
                      selectedValue={editForm.status}
                      style={styles.picker}
                      onValueChange={(itemValue) => setEditForm({ ...editForm, status: itemValue })}
                      accessibilityLabel="Select user status"
                      accessibilityHint="Choose a status for the user"
                    >
                      {statusOptions.map((status) => (
                        <Picker.Item key={status} label={status} value={status} />
                      ))}
                    </Picker>
                    <View style={styles.modalButtons}>
                      <Button title="Save" onPress={handleUpdateUser} color="#2563eb" />
                      <Button title="Cancel" onPress={() => setIsEditing(false)} color="#ef4444" />
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.name}>{selectedUser.name || 'Unnamed'}</Text>
                    <Text style={styles.role}>{selectedUser.role || 'Unknown'}</Text>
                    <Text style={styles.info}>📍 {selectedUser.location || 'N/A'}</Text>
                    <Text style={styles.info}>📧 {selectedUser.email || 'N/A'}</Text>
                    <Text style={styles.info}>📱 {selectedUser.phone || 'N/A'}</Text>
                    <Text
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            selectedUser.status === 'Active'
                              ? '#10b981'
                              : selectedUser.status === 'Pending'
                              ? '#f59e0b'
                              : selectedUser.status === 'Not Verified'
                              ? '#3b82f6'
                              : '#ef4444',
                        },
                      ]}
                    >
                      {selectedUser.status}
                    </Text>

                    <View style={styles.action}>
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => handleCall(selectedUser.phone)}
                        accessibilityLabel={`Call ${selectedUser.name || 'user'}`}
                        accessibilityHint="Initiate a phone call to this user"
                        activeOpacity={0.7}
                      >
                        <Ionicons name="call" size={22} color="#10b981" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => handleMessage(selectedUser.phone)}
                        accessibilityLabel={`Message ${selectedUser.name || 'user'}`}
                        accessibilityHint="Send a message to this user"
                        activeOpacity={0.7}
                      >
                        <MaterialIcons name="message" size={22} color="#3b82f6" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => handleSendNotification(selectedUser)}
                        accessibilityLabel={`Send notification to ${selectedUser.name || 'user'}`}
                        accessibilityHint="Send a notification to this user"
                        activeOpacity={0.7}
                      >
                        <Ionicons name="notifications" size={22} color="#f59e0b" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => openTaskModal(selectedUser)}
                        accessibilityLabel={`Assign task to ${selectedUser.name || 'user'}`}
                        accessibilityHint="Open task assignment for this user"
                        activeOpacity={0.7}
                      >
                        <FontAwesome5 name="tasks" size={20} color="#8b5cf6" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => setIsEditing(true)}
                        accessibilityLabel={`Edit ${selectedUser.name || 'user'}`}
                        accessibilityHint="Edit this user's details"
                        activeOpacity={0.7}
                      >
                        <MaterialIcons name="edit" size={22} color="#2563eb" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.iconButton}
                        onPress={handleDeleteUser}
                        accessibilityLabel={`Delete ${selectedUser.name || 'user'}`}
                        accessibilityHint="Delete this user"
                        activeOpacity={0.7}
                      >
                        <MaterialIcons name="delete" size={22} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Task Modal */}
      <Modal visible={!!taskUser} animationType="fade" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Assign Task to {taskUser?.name || 'User'}</Text>
            <TextInput
              placeholder="Enter Task Description"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              value={taskText}
              onChangeText={setTaskText}
              accessibilityLabel="Task description input"
              accessibilityHint="Enter the description for the task"
            />
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
              accessibilityLabel="Select task deadline"
              accessibilityHint="Choose a deadline date for the task"
              activeOpacity={0.7}
            >
              <Text style={styles.dateText}>Deadline: {taskDeadline.toDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={taskDeadline}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    setTaskDeadline(selectedDate);
                  }
                }}
              />
            )}

            <View style={styles.modalButtons}>
              <Button
                title="Assign Task"
                onPress={handleAssignTask}
                color="#2563eb"
                accessibilityLabel="Assign task"
                accessibilityHint="Submit the task assignment"
              />
              <Button
                title="Cancel"
                onPress={closeTaskModal}
                color="#ef4444"
                accessibilityLabel="Cancel task assignment"
                accessibilityHint="Close the task assignment modal without saving"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9fafb',
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  search: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#d1d5db',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  initials: {
    position: 'absolute',
    top: -6,
    left: -6,
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
    padding: 4,
    borderRadius: 6,
  },
  initialsLarge: {
    position: 'absolute',
    top: -8,
    left: -8,
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    padding: 6,
    borderRadius: 8,
  },
  userText: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  role: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: -55,
    gap: 8,
    marginBottom: 15,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  taskButton: {
    backgroundColor: '#f59e0b',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },

  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailCard: {
    backgroundColor: '#ffffff',
    width: '90%',
    maxWidth: 400,
    borderRadius: 14,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  largeAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  info: {
    fontSize: 15,
    color: '#374151',
    marginVertical: 5,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    width: '90%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 14,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  picker: {
    backgroundColor: '#f9fafb',
    color: '#000',
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  dateButton: {
    backgroundColor: '#e5e7eb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 15,
    color: '#374151',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 10,
  },
  action: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    gap: 8,
    marginBottom: 15,
  },
  headerButton: {
    flexDirection: 'row',
    backgroundColor: '#10b981',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '600',
  },
});