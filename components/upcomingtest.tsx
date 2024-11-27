import * as React from 'react';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { ScrollView, StyleSheet, View, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

const RightContent = () => <Avatar.Icon icon="calendar" style={styles.icon} />

const UpcomingTest = () => {
  interface Test {
    testId: number;
    testName: string;
    testMarks: number;
    testLocation: string;
    testDate: string;
    testStartTiming: string;
    testEndTiming: string;
    testDuration: number;
  }

  const [upcomingTests, setUpcomingTests] = React.useState<Test[]>([]);
  const [pastTests, setPastTests] = React.useState<Test[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentLocation, setCurrentLocation] = React.useState<{ latitude: number, longitude: number } | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const fetchTests = async () => {
      try {
        // Fetch test data
        const testResponse = await fetch(`http://${process.env.EXPO_PUBLIC_SERVER_IP_ADDRESS}:8081/test/fetch`);
        const testData = await testResponse.json();

        const currentDate = new Date();

        const upcoming: Test[] = [];
        const past: Test[] = [];

        testData.forEach((test: Test) => {
          const testStartDate = new Date(`${test.testDate}T${test.testStartTiming}:00`);
          const testEndDate = new Date(`${test.testDate}T${test.testEndTiming}:00`);
          if (testEndDate > currentDate) {
            upcoming.push(test);
          } else {
            past.push(test);
          }
        });

        setUpcomingTests(upcoming);
        setPastTests(past);

        // Fetch test IDs based on user ID
        const userIdString = await AsyncStorage.getItem('userId');
        const userId = userIdString ? parseInt(userIdString, 10) : null;
        if (userId === null) {
          Alert.alert('Error', 'User ID not found. Please log in again.');
          return;
        }
        const response = await fetch(`http://${process.env.EXPO_PUBLIC_SERVER_IP_ADDRESS}:8081/marks/fetchTestIdsByUser?userId=${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        const data = await response.json();
        if (response.ok && data) {
          const updatedUpcomingTests = upcoming.filter(test => !data.includes(test.testId));
          const updatedPastTests = [...past, ...upcoming.filter(test => data.includes(test.testId))];
          setUpcomingTests(updatedUpcomingTests);
          setPastTests(updatedPastTests);
        } else {
          Alert.alert('Error', 'Failed to fetch test IDs. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching tests:', error);
        Alert.alert('Error', 'Failed to fetch tests. Please check your internet connection.');
      } finally {
        setLoading(false);
      }
    };

    const fetchCurrentLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        console.log(`current location ${location.coords.latitude}, ${location.coords.longitude}`);
      } catch (error) {
        console.error('Error fetching current location:', error);
        Alert.alert('Error', 'Failed to fetch current location.');
      }
    };

    fetchTests();
    fetchCurrentLocation();
  }, []);

  const handleTestPress = (test: Test) => {
    const currentDate = new Date();
    const testStartDate = new Date(`${test.testDate}T${test.testStartTiming}:00`);
    const testEndDate = new Date(`${test.testDate}T${test.testEndTiming}:00`);
    const isOngoing = currentDate >= testStartDate && currentDate <= testEndDate;

    if (isOngoing && !pastTests.some(pastTest => pastTest.testId === test.testId)) {
      if (currentLocation) {
        const testLocation = parseLocation(test.testLocation);
        const distance = getDistance(currentLocation, testLocation);
        console.log(`Distance to test location: ${distance} meters`);

        if (distance > 800) {
          Alert.alert('Unable to attend test', 'You are not at the test location.');
          return;
        }

        router.push({
          pathname: '/questions',
          params: { testId: test.testId },
        });
      } else {
        Alert.alert('Error', 'Current location not available.');
      }
    }
  };

  const parseLocation = (locationString: string) => {
    const match = locationString.match(/\(([^)]+)\)/);
    if (match) {
      const [latitude, longitude] = match[1].split(',').map(Number);
      return { latitude, longitude };
    }
    return { latitude: 0, longitude: 0 };
  };

  const getDistance = (loc1: { latitude: number, longitude: number }, loc2: { latitude: number, longitude: number }) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371e3; // Earth radius in meters
    const dLat = toRad(loc2.latitude - loc1.latitude);
    const dLon = toRad(loc2.longitude - loc1.longitude);
    const lat1 = toRad(loc1.latitude);
    const lat2 = toRad(loc2.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const renderTestCard = (test: Test) => {
    const currentDate = new Date();
    const testStartDate = new Date(`${test.testDate}T${test.testStartTiming}:00`);
    const testEndDate = new Date(`${test.testDate}T${test.testEndTiming}:00`);
    const isOngoing = currentDate >= testStartDate && currentDate <= testEndDate;
    const isPast = pastTests.some(pastTest => pastTest.testId === test.testId);

    let isFar = false;
    if (isOngoing && currentLocation) {
      const testLocation = parseLocation(test.testLocation);
      const distance = getDistance(currentLocation, testLocation);
      isFar = distance > 800;
    }

    const [locationName] = test.testLocation.split(' - ');

    return (
      <TouchableOpacity onPress={() => handleTestPress(test)} key={test.testId} disabled={isPast}>
        <Card style={[styles.card, isOngoing && !isPast && (isFar ? styles.farCard : styles.ongoingCard)]}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.leftContent}>
              <Text style={styles.testName}>{test.testName}</Text>
              <Text style={styles.testDetails}>Marks: {test.testMarks}</Text>
              <Text style={styles.testDetails}>Location: {locationName}</Text>
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
    <View style={styles.container}>
      <Text style={styles.title}>UPCOMING TESTS</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {upcomingTests.map(renderTestCard)}
      </ScrollView>
      <Text style={styles.title}>PAST TESTS</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {pastTests.map(renderTestCard)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 56, // Adjust this value based on the height of the BottomNavigation bar
  },
  scrollContainer: {
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
  farCard: {
    backgroundColor: '#f8d7da', // Light red background for tests that are ongoing but the user is far
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