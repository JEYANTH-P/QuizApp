import * as React from "react";
import { View, StyleSheet, Alert, Platform, Dimensions, ScrollView } from "react-native";
import { Card, Text, TextInput, Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import * as Location from 'expo-location';

const SetTest = () => {
  const router = useRouter();
  const [testName, setTestName] = React.useState("");
  const [testMarks, setTestMarks] = React.useState("");
  const [locationName, setLocationName] = React.useState("");
  const [testLocation, setTestLocation] = React.useState(null);
  const [currentLocation, setCurrentLocation] = React.useState(null);
  const [testStartTime, setTestStartTime] = React.useState(new Date());
  const [testEndTime, setTestEndTime] = React.useState(new Date());
  const [testDate, setTestDate] = React.useState(new Date());
  const [testDuration, setTestDuration] = React.useState("");

  const [showStartTimePicker, setShowStartTimePicker] = React.useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = React.useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  React.useEffect(() => {
    (async () => {
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
      setTestLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

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
  
    const locationString = `${locationName} - (${testLocation.latitude}, ${testLocation.longitude})`;
  
    console.log("Request payload:", {
      testName,
      testMarks,
      testLocation: locationString,
      testStartTiming,
      testEndTiming,
      testDate: testDate.toISOString().split("T")[0],
      testDuration: durationInMinutes,
    });
  
    try {
      const response = await fetch(`http://${process.env.EXPO_PUBLIC_SERVER_IP_ADDRESS}:8081/test/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          testName,
          testMarks,
          testLocation: locationString,
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
          `Test Name: ${testName}, Marks: ${testMarks}, Location: ${locationString}`
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
            <Text style={styles.label}>Location Name:</Text>
            <TextInput
              mode="outlined"
              style={styles.input}
              value={locationName}
              onChangeText={setLocationName}
            />
            <Text style={styles.label}>Test Location:</Text>
            {testLocation && (
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: testLocation.latitude,
                  longitude: testLocation.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                onPress={(e) => setTestLocation(e.nativeEvent.coordinate)}
                onLongPress={(e) => setTestLocation(e.nativeEvent.coordinate)}
              >
                {currentLocation && (
                  <Marker
                    coordinate={currentLocation}
                    pinColor="blue"
                    title="Current Location"
                  />
                )}
                <Marker
                  coordinate={testLocation}
                  pinColor="red"
                  title="Test Location"
                />
              </MapView>
            )}
            <Text>Latitude: {testLocation?.latitude}</Text>
            <Text>Longitude: {testLocation?.longitude}</Text>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
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
  map: {
    width: Dimensions.get('window').width - 95,
    height: 200,
    marginVertical: 8,
  },
});

export default SetTest;