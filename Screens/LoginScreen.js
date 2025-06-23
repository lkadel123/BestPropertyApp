import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';


export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    login({ email }); // Simulated login
  };

  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome Back 👋</Text>
      <Text style={styles.subHeader}>Login to your account</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.forgot} onPress={() => alert('Forgot password flow')}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      {/* Social login buttons (UI only) */}
      <View style={styles.socialButtons}>
        <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#db4437' }]}>
          <Text style={styles.socialText}>Login with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#3b5998' }]}>
          <Text style={styles.socialText}>Login with Facebook</Text>
        </TouchableOpacity>
      </View>

      {/* Footer link to Register */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.footerLink}> Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#777',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  forgot: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  forgotText: {
    color: '#007bff',
  },
  loginButton: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#aaa',
  },
  socialButtons: {
    gap: 12,
  },
  socialButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  socialText: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#444',
  },
  footerLink: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});
