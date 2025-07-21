import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import {
  LineChart,
  PieChart,
  BarChart,
} from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: "#f5f5f5",
  backgroundGradientTo: "#f5f5f5",
  color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
  labelColor: () => "#333",
  strokeWidth: 2,
  decimalPlaces: 0,
  propsForDots: {
    r: "5",
    strokeWidth: "2",
    stroke: "#3498db",
  },
};

export default function DealCharts() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📈 Deal Performance Overview</Text>

      {/* Monthly Deals Line Chart */}
      <Text style={styles.chartLabel}>Monthly Deal Volume</Text>
      <LineChart
        data={{
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              data: [3, 6, 4, 7, 5, 9],
              color: () => "#2980b9",
              strokeWidth: 2,
            },
          ],
        }}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />

      {/* Deal Status Pie Chart */}
      <Text style={styles.chartLabel}>Deal Status Distribution</Text>
      <PieChart
        data={[
          { name: "Negotiation", population: 4, color: "#f39c12", legendFontColor: "#333", legendFontSize: 13 },
          { name: "Finalized", population: 6, color: "#27ae60", legendFontColor: "#333", legendFontSize: 13 },
          { name: "Lost", population: 2, color: "#e74c3c", legendFontColor: "#333", legendFontSize: 13 },
        ]}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        style={styles.chart}
      />

      {/* Agent-wise Bar Chart */}
      <Text style={styles.chartLabel}>Deals by Agent</Text>
      <BarChart
        data={{
          labels: ["Riya", "Amit", "Sneha", "John"],
          datasets: [
            {
              data: [5, 3, 7, 4],
            },
          ],
        }}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        verticalLabelRotation={0}
        fromZero
        showValuesOnTopOfBars
        style={styles.chart}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  chartLabel: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  chart: {
    borderRadius: 12,
  },
});
