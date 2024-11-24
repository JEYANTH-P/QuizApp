import * as React from "react";
import { View, StyleSheet, Alert, Platform } from "react-native";
import { Card, Text, TextInput, Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";

const SetTest = () => {
  const router = useRouter();
  const [testName, setTestName] = React.useState("");
  const [testMarks, setTestMarks] = React.useState("");
  const [testLocation, setTestLocation] = React.useState("");
  const [testStartTime, setTestStartTime] = React.useState(new Date());
  const [testEndTime, setTestEndTime] = React.useState(new Date());
  const [testDate, setTestDate] = React.useState(new Date());
  const [testDuration, setTestDuration] = React.useState("");

  const [showStartTimePicker, setShowStartTimePicker] = React.useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const convertDurationToMinutes = (duration) => {
    const [hours, minutes] = duration.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleSetTest = async () => {
    console.log("handleSetTest called");
    const durationInMinutes = convertDurationToMinutes(testDuration);
  
    const testStartTiming = formatTime(testStartTime);
    const testEndTiming = formatTime(testEndTime);
  
    console.log("Request payload:", {
      testName,
      testMarks,
      testLocation,
      testStartTiming,
      testEndTiming,
      testDate: testDate.toISOString().split("T")[0],
      testDuration: durationInMinutes,
    });
  
    try {
      const response = await fetch("http://10.16.48.100:8081/test/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testName,
          testMarks,
          testLocation,
          testStartTiming,
          testEndTiming,
          testDate: testDate.toISOString().split("T")[0],
          testDuration: durationInMinutes,
        }),
      });
  
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);
  
      if (response.ok) {
        const { testId } = data;
        Alert.alert(
          "Test Set",
          `Test Name: ${testName}, Marks: ${testMarks}, Location: ${testLocation}`
        );
        router.push({
          pathname: "/SetQuestions",
          params: { testName }
        });
      } else {
        Alert.alert("Error", data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    }
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
          <Text style={styles.label}>Test Start Time:</Text>
          <Button onPress={() => setShowStartTimePicker(true)}>Select Start Time</Button>
          <Text>{formatTime(testStartTime)}</Text>
          {showStartTimePicker && (
            <DateTimePicker
              value={testStartTime}
              mode="time"
              display="default"
              onChange={(event, selectedDate) => {
                setShowStartTimePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setTestStartTime(selectedDate);
                  setShowStartTimePicker(false); // Close the picker
                }
              }}
            />
          )}
          <Text style={styles.label}>Test End Time:</Text>
          <Button onPress={() => setShowEndTimePicker(true)}>Select End Time</Button>
          <Text>{formatTime(testEndTime)}</Text>
          {showEndTimePicker && (
            <DateTimePicker
              value={testEndTime}
              mode="time"
              display="default"
              onChange={(event, selectedDate) => {
                setShowEndTimePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setTestEndTime(selectedDate);
                  setShowEndTimePicker(false); // Close the picker
                }
              }}
            />
          )}
          <Text style={styles.label}>Test Date:</Text>
          <Button onPress={() => setShowDatePicker(true)}>Select Date</Button>
          <Text>{testDate.toDateString()}</Text>
          {showDatePicker && (
            <DateTimePicker
              value={testDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setTestDate(selectedDate);
                  setShowDatePicker(false); // Close the picker
                }
              }}
            />
          )}
          <Text style={styles.label}>Test Duration (HH:MM):</Text>
          <TextInput
            mode="outlined"
            style={styles.input}
            value={testDuration}
            onChangeText={setTestDuration}
            placeholder="HH:MM"
          />
        </Card.Content>
        <Card.Actions>
          <Button
            mode="contained"
            onPress={handleSetTest}
            style={styles.button}
          >
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
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6200ee",
    textAlign: "center",
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