import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';

export default function ProfileHeader() {
  const { loggedInUser } = useUser();

  const handleEditPress = () => {
    console.log('Edit Profile Pressed');
    // Navigate to edit profile screen if needed
  };

  if (!loggedInUser) return null;

  return (
    <View style={styles.container}>
      <Image
        source={
          loggedInUser.photo
            ? { uri: loggedInUser.photo }
            : ('../../assets/default-avatar.png')
        }
        style={styles.avatar}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{loggedInUser.fullName}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.role}>{loggedInUser.role}</Text>
          <View style={styles.status}>
            <Ionicons
              name={loggedInUser.isVerified ? 'checkmark-circle' : 'close-circle'}
              size={16}
              color={loggedInUser.isVerified ? 'green' : 'red'}
            />
            <Text style={styles.statusText}>
              {loggedInUser.isVerified ? 'Verified' : 'Not Verified'}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editBtn} onPress={handleEditPress}>
          <Ionicons name="create-outline" size={16} color="#fff" />
          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    bottom: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 12,
  },
  role: {
    fontSize: 14,
    color: '#555',
    backgroundColor: '#e1f5fe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 14,
    color: '#555',
  },
  editBtn: {
    flexDirection: 'row',
    marginTop: 8,
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  editText: {
    color: '#fff',
    fontSize: 14,
  },
});
