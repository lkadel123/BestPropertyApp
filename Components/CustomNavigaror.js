import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  useColorScheme,
  Animated,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import tabNavigatorConfig from '../assets/Data/Tabconfig.json';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function CustomNavigator({ state, descriptors, navigation }) {
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#fff' : '#333';
  const textColor = isDark ? '#fff' : '#333';

  const { user } = useAuth();
  const role = user?.role || 'Agent';
  const { tabs = [], more = [] } = tabNavigatorConfig[role] || {};

  const badgeCounts = {
    Leads: 5,
    More: more.length,
  };

  const dropdownAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showMoreDropdown) {
      Animated.timing(dropdownAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      dropdownAnim.setValue(0);
    }
  }, [showMoreDropdown]);

  // Auto-close More dropdown on tab change
  useEffect(() => {
    setShowMoreDropdown(false);
  }, [state.index]);

  const renderTab = (tab, isFocused) => {
    const scaleAnim = useRef(new Animated.Value(isFocused ? 1.2 : 1)).current;

    useEffect(() => {
      Animated.spring(scaleAnim, {
        toValue: isFocused ? 1.2 : 1,
        useNativeDriver: true,
      }).start();
    }, [isFocused]);

    const onPress = () => {
      if (tab.name === 'More') {
        setShowMoreDropdown(prev => !prev);
      } else {
        setShowMoreDropdown(false);
        navigation.navigate(tab.name);
      }
    };

    return (
      <TouchableOpacity key={tab.name} onPress={onPress} style={styles.tabButton}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Ionicons name={tab.icon} size={22} color={iconColor} />
          {badgeCounts[tab.name] > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {badgeCounts[tab.name] > 9 ? '9+' : badgeCounts[tab.name]}
              </Text>
            </View>
          )}
        </Animated.View>
        <Text style={[styles.tabLabel, { color: textColor }]}>{tab.label}</Text>
      </TouchableOpacity>
    );
  };

  const isTabFocused = (tabName) =>
    tabName === 'More'
      ? showMoreDropdown
      : state.index === state.routes.findIndex(r => r.name === tabName);

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeAreaWrapper}>
      {/* Center Add Button */}
      <View style={styles.centerButtonWrapper}>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddProperty')}
          activeOpacity={0.85}
          style={styles.centerButton}
        >
          <Ionicons name="add" size={36} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBarContainer}>
        <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={styles.blurBar}>
          {tabs.slice(0, 2).map(tab => renderTab(tab, isTabFocused(tab.name)))}
          <View style={styles.tabButton} />
          {tabs.slice(2).map(tab => renderTab(tab, isTabFocused(tab.name)))}
        </BlurView>
      </View>

      {/* More Dropdown */}
      {showMoreDropdown && (
        <Modal transparent animationType="none" onRequestClose={() => setShowMoreDropdown(false)}>
          <Pressable style={styles.dropdownOverlay} onPress={() => setShowMoreDropdown(false)}>
            <Animated.View
              style={[
                styles.dropdownMenu,
                {
                  opacity: dropdownAnim,
                  transform: [
                    {
                      translateY: dropdownAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                  backgroundColor: isDark ? '#222' : '#fff',
                },
              ]}
            >
              {more.map(item => (
                <TouchableOpacity
                  key={item.name}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setShowMoreDropdown(false);
                    navigation.navigate(item.name);
                  }}
                >
                  <View style={styles.dropdownItemContent}>
                    <Ionicons
                      name={item.icon}
                      size={18}
                      color={isDark ? '#fff' : '#333'}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={[styles.dropdownText, { color: isDark ? '#fff' : '#333' }]}>
                      {item.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </Animated.View>
          </Pressable>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaWrapper: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  tabBarContainer: {
    marginHorizontal: 10,
    height: 65,
    borderRadius: 40,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  blurBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  centerButtonWrapper: {
    position: 'absolute',
    bottom: 8,
    left: width / 2 - 30,
    zIndex: 20,
  },
  centerButton: {
    marginBottom: -3,
    backgroundColor: '#007bff',
    width: 55,
    height: 55,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 12,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#ff3b30',
    borderRadius: 10,
    minWidth: 16,
    paddingHorizontal: 4,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  dropdownOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingBottom: 100,
    paddingRight: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdownMenu: {
    width: 180,
    borderRadius: 8,
    paddingVertical: 8,
    elevation: 6,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  dropdownText: {
    fontSize: 14,
  },
  dropdownItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
