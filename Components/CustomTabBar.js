import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  useColorScheme,
  Animated, Modal, Pressable,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Dummy badge data (replace with real data later)
const badgeCounts = {
  Leads: 5,
  More: 2,
};

export default function CustomTabBar({ state, descriptors, navigation }) {
  const [showMoreDropdown, setShowMoreDropdown] = React.useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#fff' : '#333';
  const textColor = isDark ? '#fff' : '#333';

  const leftTabs = state.routes.slice(0, 2);
  const centerTab = state.routes.find(route => route.name === 'AddProperty');
  const rightTabs = state.routes.slice(2).filter(route => route.name !== 'AddProperty');

  const renderTab = (route, isFocused) => {
    const { options } = descriptors[route.key];
    const label = options.tabBarLabel ?? route.name;

    const scaleAnim = React.useRef(new Animated.Value(isFocused ? 1.2 : 1)).current;

    React.useEffect(() => {
      Animated.spring(scaleAnim, {
        toValue: isFocused ? 1.2 : 1,
        useNativeDriver: true,
      }).start();
    }, [isFocused]);

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (route.name === 'More') {
        setShowMoreDropdown(prev => !prev); // Toggle dropdown
        return;
      }

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    let iconName;
    switch (route.name) {
      case 'Agenda':
        iconName = isFocused ? 'calendar' : 'calendar-outline';
        break;
      case 'Leads':
        iconName = isFocused ? 'people' : 'people-outline';
        break;
      case 'Members':
        iconName = isFocused ? 'person-circle' : 'person-circle-outline';
        break;
      case 'More':
        iconName = isFocused ? 'ellipsis-horizontal' : 'ellipsis-horizontal-outline';
        break;
      default:
        iconName = 'ellipse-outline';
    }

    return (
      <TouchableOpacity
        key={route.key}
        accessibilityRole="button"
        onPress={onPress}
        style={styles.tabButton}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Ionicons name={iconName} size={22} color={iconColor} />
          {badgeCounts[route.name] > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {badgeCounts[route.name] > 9 ? '9+' : badgeCounts[route.name]}
              </Text>
            </View>
          )}
        </Animated.View>
        <Text style={[styles.tabLabel, { color: textColor }]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeAreaWrapper}>
      <View style={styles.centerButtonWrapper}>
        <TouchableOpacity
          onPress={() => {
            const targetRoute = state.routes.find(r => r.name === 'AddProperty');
            if (targetRoute) {
              navigation.navigate('AddProperty');
            } else {
              console.warn('❗ "AddProperty" route not found in TabNavigator');
            }
          }}
          activeOpacity={0.85}
          style={styles.centerButton}
        >
          <Ionicons name="add" size={36} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabBarContainer}>
        <BlurView
          intensity={80}
          tint={isDark ? 'dark' : 'light'}
          style={styles.blurBar}
        >
          {/* Left Tabs */}
          {leftTabs.map((route) =>
            renderTab(route, state.index === state.routes.findIndex(r => r.key === route.key))
          )}

          {/* Center Spacer */}
          <View style={styles.tabButton} />

          {/* Right Tabs */}
          {rightTabs.map((route) =>
            renderTab(route, state.index === state.routes.findIndex(r => r.key === route.key))
          )}
        </BlurView>
      </View>
      {showMoreDropdown && (
        <Modal transparent animationType="fade" onRequestClose={() => setShowMoreDropdown(false)}>
          <Pressable
            style={styles.dropdownOverlay}
            onPress={() => setShowMoreDropdown(false)}
          >
            <View style={styles.dropdownMenu}>

              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setShowMoreDropdown(false);
                  navigation.navigate('PropertiesScreen');
                }}
              >
                <View style={styles.dropdownItemContent}>
                  <Ionicons name="home-outline" size={18} color="#333" style={{ marginRight: 8 }} />
                  <Text style={styles.dropdownText}>Properties</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setShowMoreDropdown(false);
                  navigation.navigate('TaskScreen');
                }}
              >
                <View style={styles.dropdownItemContent}>
                  <Ionicons name="checkbox-outline" size={18} color="#333" style={{ marginRight: 8 }} />
                  <Text style={styles.dropdownText}>Task</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setShowMoreDropdown(false);
                  navigation.navigate('EventScreen');
                }}
              >
                <View style={styles.dropdownItemContent}>
                  <Ionicons name="calendar-outline" size={18} color="#333" style={{ marginRight: 8 }} />
                  <Text style={styles.dropdownText}>Events</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setShowMoreDropdown(false);
                  navigation.navigate('NotificationsScreen');
                }}
              >
                <View style={styles.dropdownItemContent}>
                  <Ionicons name="notifications-outline" size={18} color="#333" style={{ marginRight: 8 }} />
                  <Text style={styles.dropdownText}>Notifications</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setShowMoreDropdown(false);
                  navigation.navigate('ReportsScreen');
                }}
              >
                <View style={styles.dropdownItemContent}>
                  <Ionicons name="document-text-outline" size={18} color="#333" style={{ marginRight: 8 }} />
                  <Text style={styles.dropdownText}>Reports</Text>

                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setShowMoreDropdown(false);
                  navigation.navigate('DealManagementScreen');
                }}
              >
                <View style={styles.dropdownItemContent}>
                  <Ionicons name="briefcase-outline" size={18} color="#333" style={{ marginRight: 8 }} />
                  <Text style={styles.dropdownText}>Deals</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setShowMoreDropdown(false);
                  navigation.navigate('ProfileScreen');
                }}
              >
                <View style={styles.dropdownItemContent}>
                  <Ionicons name="person-outline" size={18} color="#333" style={{ marginRight: 8 }} />
                  <Text style={styles.dropdownText}>Profile</Text>
                </View>
              </TouchableOpacity>

              {/* Add more items here if needed */}
            </View>
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
    height: 60,
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
    paddingHorizontal: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
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
    width: 160,
    backgroundColor: '#fff',
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
    color: '#333',
  },
  dropdownItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});



