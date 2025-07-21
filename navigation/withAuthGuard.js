// Components/Auth/withAuthGuard.js
import React, { useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

export default function withAuthGuard(WrappedComponent) {
  return function Guarded(props) {
    const { isLoggedIn } = useContext(AuthContext);
    const navigation = useNavigation();

    useEffect(() => {
      if (!isLoggedIn) {
        Alert.alert('Login Required', 'Please log in to continue.', [
          {
            text: 'Go to Login',
            onPress: () => navigation.navigate('Login'),
          },
          { text: 'Cancel', style: 'cancel' },
        ]);
      }
    }, [isLoggedIn]);

    if (!isLoggedIn) return null; // Or show fallback

    return <WrappedComponent {...props} />;
  };
}


