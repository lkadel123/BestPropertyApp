import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';

const TeamOverviewCard = ({ teamStats }) => {
  const {
    totalMembers = 10,
    sales = 4,
    telecallers = 3,
    siteCoordinators = 2,
    callsToday = 75,
    tasksAssigned = 40,
    tasksCompleted = 28,
  } = teamStats || {};

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>👥 Team Overview</Text>

      <View style={styles.statRow}>
        <StatItem
          icon={<Ionicons name="people" size={20} color="#007BFF" />}
          label="Total Members"
          value={totalMembers}
        />
        <StatItem
          icon={<FontAwesome5 name="user-tie" size={18} color="#28a745" />}
          label="Sales"
          value={sales}
        />
        <StatItem
          icon={<MaterialIcons name="call" size={20} color="#f39c12" />}
          label="Telecallers"
          value={telecallers}
        />
        <StatItem
          icon={<Ionicons name="walk" size={20} color="#6f42c1" />}
          label="Site Coord."
          value={siteCoordinators}
        />
      </View>

      <View style={styles.divider} />

      <View style={styles.statRow}>
        <StatItem
          icon={<Ionicons name="call-outline" size={20} color="#e83e8c" />}
          label="Calls Today"
          value={callsToday}
        />
        <StatItem
          icon={<MaterialIcons name="check-circle" size={20} color="#17a2b8" />}
          label="Tasks Completed"
          value={`${tasksCompleted}/${tasksAssigned}`}
        />
      </View>
    </View>
  );
};

const StatItem = ({ icon, label, value }) => (
  <View style={styles.statItem}>
    {icon}
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    marginBottom: 16,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    width: '23%',
    marginBottom: 16,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 6,
    color: '#333',
  },
  label: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  divider: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});

export default TeamOverviewCard;
