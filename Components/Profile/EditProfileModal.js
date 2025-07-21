// /components/Profile/EditProfileModal.js

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileModal({ visible, onClose, initialData, onSave }) {
  const [name, setName] = useState(initialData.name || '');
  const [email, setEmail] = useState(initialData.email || '');
  const [phone, setPhone] = useState(initialData.phone || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState(initialData.image || null);

  const validatePassword = (pwd) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    return strongRegex.test(pwd);
  };

  const handleSave = () => {
    if (!name || !email || !phone) {
      Alert.alert('Error', 'Name, email, and phone cannot be empty.');
      return;
    }

    if (password && (!validatePassword(password) || password !== confirmPassword)) {
      Alert.alert(
        'Invalid Password',
        'Password must be 8+ characters and include uppercase, lowercase, number, and special character. Confirm password must match.'
      );
      return;
    }

    const updatedData = {};
    if (name !== initialData.name) updatedData.name = name;
    if (email !== initialData.email) updatedData.email = email;
    if (phone !== initialData.phone) updatedData.phone = phone;
    if (image && image !== initialData.image) updatedData.image = image;
    if (password) updatedData.password = password;

    if (Object.keys(updatedData).length === 0) {
      Alert.alert('No Changes', 'Nothing was updated.');
      return;
    }

    try {
      onSave(updatedData);
      onClose();
    } catch (err) {
      console.error('Profile update failed:', err);
      Alert.alert('Update Failed', 'Something went wrong while updating. Try again.');
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Denied', 'Camera access is required to update photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.6,
      base64: false,
    });

    if (!result.cancelled) {
      const selected = result.assets?.[0]?.uri || result.uri;
      if (selected) setImage(selected);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Edit Profile</Text>

        <TouchableOpacity onPress={pickImage} style={styles.imageWrapper}>
          <Image
            source={image ? { uri: image } : require('../../assets/default-avatar.png')}
            style={styles.avatar}
          />
          <View style={styles.cameraIcon}>
            <Ionicons name="camera-outline" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="New Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#777"
            />
          </TouchableOpacity>
        </View>

        {password.length > 0 && (
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  imageWrapper: {
    alignSelf: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#007bff',
    borderRadius: 12,
    padding: 4,
  },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
    fontSize: 15,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  cancelBtn: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ccc',
    flex: 0.45,
  },
  saveBtn: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#007bff',
    flex: 0.45,
  },
  cancelText: {
    textAlign: 'center',
    color: '#222',
    fontWeight: '600',
  },
  saveText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
  },
});
