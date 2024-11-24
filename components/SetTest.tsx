// components/SetTest.tsx
import * as React from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";

const SetTest = ({ onSetTest }) => {
  const [testName, setTestName] = React.useState("");
  const [testMarks, setTestMarks] = React.useState("");
  const [testLocation, setTestLocation] = React.useState("");

  const handleSetTest = () => {
    // Handle setting the test logic here
    Alert.alert(
      "Test Set",
      `Test Name: ${testName}, Marks: ${testMarks}, Location: ${testLocation}`
    );
    onSetTest();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Test Name:</Text>
      <TextInput
        style={styles.input}
        value={testName}
        onChangeText={setTestName}
      />
      <Text style={styles.label}>Test Marks:</Text>
      <TextInput
        style={styles.input}
        value={testMarks}
        onChangeText={setTestMarks}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Test Location:</Text>
      <TextInput
        style={styles.input}
        value={testLocation}
        onChangeText={setTestLocation}
      />
      <Button title="Set Test" onPress={handleSetTest} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 8,
  },
});

export default SetTest;
