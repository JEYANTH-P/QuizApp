import * as React from 'react';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { ScrollView, StyleSheet, View, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';

import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RightContent = () => <Avatar.Icon icon="check" style={styles.icon} />

const sampleCompletedTests = [
  {
    testId: 1,
    testName: 'Math Test',
    testMarks: 100,
    awardedMarks: 90,
  },
  {
    testId: 2,
    testName: 'Science Test',
    testMarks: 100,
    awardedMarks: 80,
  },
  {
    testId: 3,
    testName: 'History Test',
    testMarks: 100,
    awardedMarks: 70,
  },
];

const Marks = () => {
  const [completedTests, setCompletedTests] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    const fetchCompletedTests = async () => {
      try {
        // Simulate fetching completed tests
        setCompletedTests(sampleCompletedTests);
      } catch (error) {
        console.error('Error fetching completed tests:', error);
        Alert.alert('Error', 'Failed to fetch completed tests. Please check your internet connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedTests();
  }, []);

  const handleTestPress = (test) => {
    router.push({
      pathname: './testdetails',
      params: { 
        testId: test.testId,
        testName: test.testName,
        testMarks: test.testMarks,
      },
    });
  };

  const renderTestCard = (test) => {
    return (
      <TouchableOpacity onPress={() => handleTestPress(test)} key={test.testId}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.leftContent}>
              <Text style={styles.testName}>{test.testName}</Text>
              <Text style={styles.testDetails}>Total Marks: {test.testMarks}</Text>
            </View>
            <View style={styles.rightContent}>
              <RightContent />
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ee" />;
  }

  return (
    <View>
      <Text style={styles.title}>COMPLETED TESTS</Text>
      <ScrollView contentContainerStyle={styles.container}>
        {completedTests.map(renderTestCard)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  leftContent: {
    alignItems: 'center',
  },
  rightContent: {
    alignItems: 'center',
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    color: "#6200ee",
    textAlign: "center",
    fontWeight: "700",
  },
  testName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  testDetails: {
    fontSize: 14,
    color: 'gray',
  },
});

export default Marks;