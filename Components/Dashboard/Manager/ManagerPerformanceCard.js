import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons, Feather } from '@expo/vector-icons';

const ManagerPerformanceCard = ({ data }) => {
  const {
    totalTeamMembers = 5,
    leadsHandled = 120,
    dealsClosed = 34,
    tasksAssigned = 75,
    activeProjects = 4,
  } = data || {};

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>📊 Manager Performance Overview</Text>

      <View style={styles.row}>
        <Metric
          icon={<Ionicons name="people" size={22} color="#007BFF" />}
          label="Team Members"
          value={totalTeamMembers}
        />
        <Metric
          icon={<MaterialIcons name="leaderboard" size={22} color="#28a745" />}
          label="Leads Handled"
          value={leadsHandled}
        />
      </View>

      <View style={styles.row}>
        <Metric
          icon={<FontAwesome5 name="handshake" size={20} color="#f39c12" />}
          label="Deals Closed"
          value={dealsClosed}
        />
        <Metric
          icon={<Feather name="check-circle" size={22} color="#dc3545" />}
          label="Tasks Assigned"
          value={tasksAssigned}
        />
      </View>

      <View style={styles.row}>
        <Metric
          icon={<MaterialIcons name="location-city" size={22} color="#6f42c1" />}
          label="Active Projects"
          value={activeProjects}
        />
      </View>
    </View>
  );
};

const Metric = ({ icon, label, value }) => (
  <View style={styles.metricBox}>
    {icon}
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  metricBox: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
    color: '#333',
  },
  metricLabel: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
    marginTop: 2,
  },
});

export default ManagerPerformanceCard;
