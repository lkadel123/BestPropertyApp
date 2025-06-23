import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext'; // <-- add this

export default function AccountScreen({ navigation }) {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const backgroundColor = isDarkMode ? '#000' : '#fff';
  const textColor = isDarkMode ? '#fff' : '#000';
  const inputBg = isDarkMode ? '#111' : '#f9f9f9';
  const borderColor = isDarkMode ? '#444' : '#ddd';

  const [profileImage, setProfileImage] = useState(null);
  const [fullName, setFullName] = useState('Yagya Prasad');
  const [email, setEmail] = useState('yagya@example.com');
  const [phone, setPhone] = useState('+91 9876543210');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('Hello, I am a mobile developer.');

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    Alert.alert('Saved', 'Your account has been updated.');
  };

  const handleLogout = () => {
    Alert.alert('Logged Out', 'You have been logged out.');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.header, { color: textColor }]}>My Account</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="camera" size={28} color="#888" />
            <Text style={{ color: '#888', fontSize: 12 }}>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Fields */}
      <Field label="Full Name" value={fullName} onChangeText={setFullName} icon="person" isDarkMode={isDarkMode} inputBg={inputBg} borderColor={borderColor} textColor={textColor} />
      <Field label="Email" value={email} onChangeText={setEmail} icon="mail" keyboardType="email-address" isDarkMode={isDarkMode} inputBg={inputBg} borderColor={borderColor} textColor={textColor} />
      <Field label="Phone" value={phone} onChangeText={setPhone} icon="call" keyboardType="phone-pad" isDarkMode={isDarkMode} inputBg={inputBg} borderColor={borderColor} textColor={textColor} />
      <Field label="Date of Birth" value={dob} onChangeText={setDob} icon="calendar" isDarkMode={isDarkMode} inputBg={inputBg} borderColor={borderColor} textColor={textColor} />
      <Field label="Gender (Male/Female/Other)" value={gender} onChangeText={setGender} icon="transgender" isDarkMode={isDarkMode} inputBg={inputBg} borderColor={borderColor} textColor={textColor} />
      <Field label="About Me" value={bio} onChangeText={setBio} icon="chatbox" multiline={true} isDarkMode={isDarkMode} inputBg={inputBg} borderColor={borderColor} textColor={textColor} />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Ionicons name="save-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Field({ label, value, onChangeText, icon, keyboardType, multiline, isDarkMode, inputBg, borderColor, textColor }) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      <View style={[
        styles.inputWrapper,
        multiline && { alignItems: 'flex-start' },
        { backgroundColor: inputBg, borderColor }
      ]}>
        <Ionicons name={icon} size={20} color="#888" style={{ marginRight: 10, marginTop: multiline ? 6 : 0 }} />
        <TextInput
          style={[styles.input, multiline && { height: 80, textAlignVertical: 'top' }, { color: textColor }]}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType || 'default'}
          multiline={multiline}
          placeholderTextColor={isDarkMode ? '#aaa' : '#666'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  input: {
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    justifyContent: 'center',
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: '600',
    fontSize: 16,
  },
});

