import * as React from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, TextInput, Button, Card, IconButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const sampleTests = [
  { testId: 1, testName: 'Math Test' },
  { testId: 2, testName: 'Science Test' },
  { testId: 3, testName: 'History Test' },
];

const Enroll = () => {
  const [tests, setTests] = React.useState(sampleTests);
  const [selectedTest, setSelectedTest] = React.useState<number | null>(null);
  const [studentEmail, setStudentEmail] = React.useState('');
  const [enrolledStudents, setEnrolledStudents] = React.useState<{ testId: number; email: string }[]>([]);

  // Commented out the fetch request
  // React.useEffect(() => {
  //   const fetchTests = async () => {
  //     try {
  //       const userId = await AsyncStorage.getItem('userId');
  //       if (!userId) {
  //         Alert.alert('Error', 'User ID not found. Please log in again.');
  //         return;
  //       }

  //       const response = await fetch(`http://10.16.48.100:8081/tests/fetchByUser?userId=${userId}`, {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       });

  //       const data = await response.json();
  //       if (response.ok) {
  //         setTests(data.tests);
  //       } else {
  //         Alert.alert('Error', 'Failed to fetch tests. Please try again.');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching tests:', error);
  //       Alert.alert('Error', 'Failed to fetch tests. Please check your internet connection.');
  //     }
  //   };

  //   fetchTests();
  // }, []);

  const handleEnrollStudent = () => {
    if (!selectedTest) {
      Alert.alert('Error', 'Please select a test.');
      return;
    }
    if (!studentEmail) {
      Alert.alert('Error', 'Please enter a student email.');
      return;
    }

    setEnrolledStudents([...enrolledStudents, { testId: selectedTest, email: studentEmail }]);
    setStudentEmail('');
    Alert.alert('Success', 'Student enrolled successfully.');
  };

  const handleDeleteStudent = (email: string) => {
    setEnrolledStudents(enrolledStudents.filter(student => student.email !== email));
    Alert.alert('Success', 'Student removed successfully.');
  };

  const filteredStudents = enrolledStudents.filter(student => student.testId === selectedTest);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Enroll Students</Text>
      <Card style={styles.card}>
        <Card.Content>
          <Picker
            selectedValue={selectedTest}
            onValueChange={(itemValue) => setSelectedTest(itemValue)}
            style={styles.picker}
          >
            {tests.map(test => (
              <Picker.Item key={test.testId} label={test.testName} value={test.testId} />
            ))}
          </Picker>
          <Text style={styles.label}>Student Email:</Text>
          <TextInput
            mode="outlined"
            style={styles.input}
            value={studentEmail}
            onChangeText={setStudentEmail}
            keyboardType="email-address"
          />
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={handleEnrollStudent} style={styles.button}>
            Enroll Student
          </Button>
        </Card.Actions>
      </Card>
      <Text style={styles.subtitle}>Enrolled Students</Text>
      {filteredStudents.map((student, index) => (
        <Card key={index} style={styles.card}>
          <Card.Content>
            <View style={styles.studentRow}>
              <Text>Email: {student.email}</Text>
              <IconButton
                icon="delete"
                onPress={() => handleDeleteStudent(student.email)}
              />
            </View>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200ee',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    margin: 16,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  picker: {
    marginVertical: 8,
  },
  button: {
    marginTop: 16,
  },
  input: {
    marginVertical: 8,
  },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Enroll;