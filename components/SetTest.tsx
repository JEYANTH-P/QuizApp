import * as React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Card, Text, TextInput, Button } from "react-native-paper";
import { useRouter } from 'expo-router';

const SetTest = () => {
  const router = useRouter();
  const [testName, setTestName] = React.useState("");
  const [testMarks, setTestMarks] = React.useState("");
  const [testLocation, setTestLocation] = React.useState("");

  const handleSetTest = () => {
    // Handle setting the test logic here
    Alert.alert(
      "Test Set",
      `Test Name: ${testName}, Marks: ${testMarks}, Location: ${testLocation}`
    );
    router.push('/SetQuestions'); // Navigate to SetQuestions
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Quiz</Text>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.label}>Test Name:</Text>
          <TextInput
            mode="outlined"
            style={styles.input}
            value={testName}
            onChangeText={setTestName}
          />
          <Text style={styles.label}>Test Marks:</Text>
          <TextInput
            mode="outlined"
            style={styles.input}
            value={testMarks}
            onChangeText={setTestMarks}
            keyboardType="numeric"
          />
          <Text style={styles.label}>Test Location:</Text>
          <TextInput
            mode="outlined"
            style={styles.input}
            value={testLocation}
            onChangeText={setTestLocation}
          />
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={handleSetTest} style={styles.button}>
            Set Test
          </Button>
        </Card.Actions>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  card: {
    margin: 16,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    marginVertical: 8,
  },
  button: {
    marginTop: 16,
  },
});

export default SetTest;