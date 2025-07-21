import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const subscriptionData = {
  planName: 'Agent Pro',
  tier: 'Pro', // Basic | Premium | Pro
  features: [
    '50 leads/day',
    'Top Listing Visibility',
    'Verified Badge',
    'Priority Support',
  ],
  renewalDate: '2025-08-15',
  price: '₹1,999 / month',
};

const getTierStyles = (tier) => {
  switch (tier) {
    case 'Basic':
      return { backgroundColor: '#f1f8e9', textColor: '#33691e' };
    case 'Premium':
      return { backgroundColor: '#e3f2fd', textColor: '#01579b' };
    case 'Pro':
      return { backgroundColor: '#fff3e0', textColor: '#e65100' };
    default:
      return { backgroundColor: '#f5f5f5', textColor: '#333' };
  }
};

const getDaysLeft = (renewalDate) => {
  const today = new Date();
  const target = new Date(renewalDate);
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : 0;
};

export default function SubscriptionCard() {
  const { planName, tier, features, renewalDate, price } = subscriptionData;
  const { backgroundColor, textColor } = getTierStyles(tier);
  const daysLeft = getDaysLeft(renewalDate);

  const handleUpgrade = () => {
    console.log('Upgrade Plan Clicked');
    // navigate to pricing page or open plan selector
  };

  return ( 
    <View style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="star" size={22} color={textColor} />
        <Text style={[styles.planName, { color: textColor }]}>{planName}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Current Plan</Text>
        </View>
      </View>

      {/* Feature List */}
      <Text style={[styles.sectionTitle, { color: textColor }]}>Features:</Text>
      {features.map((item, index) => (
        <View style={styles.featureRow} key={index}>
          <Ionicons name="checkmark-circle" size={18} color="#4caf50" />
          <Text style={styles.featureText}>{item}</Text>
        </View>
      ))}

      {/* Renewal Info */}
      <View style={styles.renewalBox}>
        <MaterialIcons name="event-available" size={18} color="#555" />
        <Text style={styles.renewalText}>
          Renews on {renewalDate} ({daysLeft} days left)
        </Text>
      </View>

      {/* CTA */}
      <TouchableOpacity style={styles.upgradeBtn} onPress={handleUpgrade}>
        <Text style={styles.upgradeText}>Upgrade Plan</Text>
        <Text style={styles.priceText}>{price}</Text>
      </TouchableOpacity>

      {/* Compare */}
      <TouchableOpacity
        onPress={() => console.log('Compare Plans')}
        style={styles.compareBtn}
      >
        <Text style={styles.compareText}>Compare All Plans</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
  },
  badge: {
    marginLeft: 'auto',
    backgroundColor: '#4caf50',
    paddingHorizontal: 8,
    paddingVertical: Platform.OS === 'ios' ? 4 : 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  sectionTitle: {
    marginBottom: 6,
    fontWeight: '500',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 2,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
  },
  renewalBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  renewalText: {
    fontSize: 14,
    color: '#555',
  },
  upgradeBtn: {
    marginTop: 16,
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  upgradeText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  priceText: {
    fontSize: 13,
    color: '#fff',
    marginTop: 2,
  },
  compareBtn: {
    marginTop: 12,
    alignItems: 'center',
  },
  compareText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007bff',
  },
});
