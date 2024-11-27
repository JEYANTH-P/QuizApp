import * as React from 'react';
import { Avatar, Button, Card, Text, Dialog, Portal, Paragraph } from 'react-native-paper';
import { ScrollView, StyleSheet, View, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const RightContent = () => <Avatar.Icon icon="calendar" style={styles.icon} />

const ViewMarks = () => {
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
  const [visible, setVisible] = React.useState(false);
  const [selectedTestId, setSelectedTestId] = React.useState<number | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const fetchTests = async () => {
      try {
        // Fetch test data
        const testResponse = await fetch('http://10.11.148.18:8081/test/fetch');
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
      } catch (error) {
        console.error('Error fetching tests:', error);
        Alert.alert('Error', 'Failed to fetch tests. Please check your internet connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const showDialog = (testId: number) => {
    setSelectedTestId(testId);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setSelectedTestId(null);
  };

  const handleCancelTest = () => {
    if (selectedTestId !== null) {
      setUpcomingTests(upcomingTests.filter(test => test.testId !== selectedTestId));
      Alert.alert('Success', 'Test cancelled successfully.');
      hideDialog();
    }
  };

  const handleViewReport = (testId: number, testName: string) => {
    router.push({
      pathname: '/report',
      params: { testId, testName },
    });
  };

  const renderTestCard = (test: { testDate: any; testStartTiming: any; testEndTiming: any; testId: any; testName?: any; testMarks?: any; testLocation?: any; testDuration?: any; }) => {
    const currentDate = new Date();
    const testStartDate = new Date(`${test.testDate}T${test.testStartTiming}:00`);
    const testEndDate = new Date(`${test.testDate}T${test.testEndTiming}:00`);
    const isUpcoming = testStartDate > currentDate;
    const isOngoing = currentDate >= testStartDate && currentDate <= testEndDate;

    return (
      <TouchableOpacity key={test.testId} onPress={() => handleViewReport(test.testId, test.testName)}>
        <Card style={[styles.card, isOngoing && styles.ongoingCard]}>
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
              {isUpcoming && (
                <Button mode="contained" onPress={() => showDialog(test.testId)} style={styles.button}>
                  Cancel Test
                </Button>
              )}
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
      <View style={styles.section}>
        <Text style={styles.title}>Upcoming Tests</Text>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {upcomingTests.map(renderTestCard)}
        </ScrollView>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Past Tests</Text>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {pastTests.map(renderTestCard)}
        </ScrollView>
      </View>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Warning</Dialog.Title>
          <Dialog.Content>
            <Paragraph>This action cannot be reversed. Are you sure you want to cancel this test?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>No</Button>
            <Button onPress={handleCancelTest}>Yes</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0, // Adjust this value based on the height of the BottomNavigation bar
  },
  section: {
    flex: 1,
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
    marginTop: 24,
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
  button: {
    marginTop: 8,
  },
});

export default ViewMarks;