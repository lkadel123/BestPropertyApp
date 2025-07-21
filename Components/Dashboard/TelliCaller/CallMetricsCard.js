import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const CallMetricsCard = () => {
  return (
    <View>
      <Text style={styles.title}>📊 Today's Summary</Text>
      <View style={styles.row}>
        <Metric icon="phone" label="Calls" value="42" />
        <Metric icon="users" label="Leads" value="18" />
        <Metric icon="check" label="Follow-ups" value="12" />
      </View>
    </View>
  );
};

const Metric = ({ icon, label, value }) => (
  <View style={styles.metric}>
    <FontAwesome5 name={icon} size={20} />
    <Text>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  metric: { alignItems: 'center', flex: 1 },
  value: { fontSize: 16, fontWeight: 'bold', marginTop: 4 },
});

export default CallMetricsCard;