import * as React from 'react';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { ScrollView, StyleSheet, View, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RightContent = () => <Avatar.Icon icon="calendar" style={styles.icon} />

const sampleTests = [
  {
    testId: 1,
    testName: 'Math Test',
    testMarks: 100,
    testStartTiming: '0:00',
    testEndTiming: '20:59',
    testLocation: 'Room 101',
    testDate: '2024-11-24',
    testDuration: 120,
  },
  {
    testId: 2,
    testName: 'Science Test',
    testMarks: 100,
    testStartTiming: '13:00',
    testEndTiming: '15:00',
    testLocation: 'Room 102',
    testDate: '2023-12-05',
    testDuration: 120,
  },
  {
    testId: 3,
    testName: 'History Test',
    testMarks: 100,
    testStartTiming: '09:00',
    testEndTiming: '11:00',
    testLocation: 'Room 103',
    testDate: '2023-12-10',
    testDuration: 120,
  },
];

const UpcomingTest = () => {
  const [upcomingTests, setUpcomingTests] = React.useState([]);
  const [pastTests, setPastTests] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    const fetchCurrentTime = async () => {
      try {
        const currentDate = new Date();

        const upcoming = [];
        const past = [];

        sampleTests.forEach(test => {
          const testStartDate = new Date(`${test.testDate}T${test.testStartTiming}:00`);
          const testEndDate = new Date(`${test.testDate}T${test.testEndTiming}:00`);
          console.log(`Current Date: ${currentDate}`);
          console.log(`Test Start Date: ${testStartDate}`);
          console.log(`Test End Date: ${testEndDate}`);
          if (testEndDate > currentDate) {
            upcoming.push(test);
          } else {
            past.push(test);
          }
        });

        setUpcomingTests(upcoming);
        setPastTests(past);

        // Simulate backend response
        const data = { testIds: [1] };
        if (data.testIds) {
          const updatedUpcomingTests = upcoming.filter(test => !data.testIds.includes(test.testId));
          const updatedPastTests = [...past, ...upcoming.filter(test => data.testIds.includes(test.testId))];
          setUpcomingTests(updatedUpcomingTests);
          setPastTests(updatedPastTests);
        }
      } catch (error) {
        console.error('Error fetching current time:', error);
        Alert.alert('Error', 'Failed to fetch current time. Please check your internet connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentTime();
  }, []);

  const handleTestPress = (test) => {
    const currentDate = new Date();
    const testStartDate = new Date(`${test.testDate}T${test.testStartTiming}:00`);
    const testEndDate = new Date(`${test.testDate}T${test.testEndTiming}:00`);
    const isOngoing = currentDate >= testStartDate && currentDate <= testEndDate;

    if (isOngoing && !pastTests.some(pastTest => pastTest.testId === test.testId)) {
      router.push({
        pathname: '/questions',
        params: { testId: test.testId },
      });
    }
  };

  const renderTestCard = (test) => {
    const currentDate = new Date();
    const testStartDate = new Date(`${test.testDate}T${test.testStartTiming}:00`);
    const testEndDate = new Date(`${test.testDate}T${test.testEndTiming}:00`);
    const isOngoing = currentDate >= testStartDate && currentDate <= testEndDate;
    const isPast = pastTests.some(pastTest => pastTest.testId === test.testId);

    return (
      <TouchableOpacity onPress={() => handleTestPress(test)} key={test.testId} disabled={isPast}>
        <Card style={[styles.card, isOngoing && !isPast && styles.ongoingCard]}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.leftContent}>
              <Text style={styles.testName}>{test.testName}</Text>
              <Text style={styles.testDetails}>Marks: {test.testMarks}</Text>
              <Text style={styles.testDetails}>Location: {test.testLocation}</Text>
            </View>
            <View style={styles.rightContent}>
              <RightContent />
              <Text style={styles.testDetails}>Date: {test.testDate}</Text>
              <Text style={styles.testDetails}>Time: {test.testStartTiming} - {test.testEndTiming}</Text>
              <Text style={styles.testDetails}>Duration: {test.testDuration} mins</Text>
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
      <Text style={styles.title}>UPCOMING TESTS</Text>
      <ScrollView contentContainerStyle={styles.container}>
        {upcomingTests.map(renderTestCard)}
      </ScrollView>
      <Text style={styles.title}>PAST TESTS</Text>
      <ScrollView contentContainerStyle={styles.container}>
        {pastTests.map(renderTestCard)}
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
  ongoingCard: {
    backgroundColor: '#d4edda', // Light green background for ongoing tests
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

export default UpcomingTest;





