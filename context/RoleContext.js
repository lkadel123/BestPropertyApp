// RoleContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const roles = {
  ADMIN: 'admin',
  BUYER: 'buyer',
  SELLER: 'seller',
  AGENT: 'agent',
  TELECALLER: 'telecaller',
  LEADER: 'leader',
  MANAGER: 'manager',
  GUEST: 'guest',
};

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(roles.GUEST);

  const switchRole = async (newRole) => {
    if (Object.values(roles).includes(newRole)) {
      setRole(newRole);
      await AsyncStorage.setItem('role', newRole);
    } else {
      console.warn(`Invalid role: ${newRole}`);
    }
  };

  const clearRole = async () => {
    setRole(roles.GUEST);
    await AsyncStorage.removeItem('role');
  };

  const loadStoredRole = async () => {
    const storedRole = await AsyncStorage.getItem('role');
    if (storedRole && Object.values(roles).includes(storedRole)) {
      setRole(storedRole);
    }
  };

  useEffect(() => {
    loadStoredRole();
  }, []);

  return (
    <RoleContext.Provider value={{ role, setRole: switchRole, clearRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);


