import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Button } from "react-native-paper";
import SetTest from "@/components/SetTest";
import SetQuestions from "@/components/SetQuestions";

const SetTestRoute = ({ onSetTest }: { onSetTest: () => void }) => (
  <View style={styles.container}>
    <SetTest onSetTest={onSetTest} />
  </View>
);

const SetQuestionsRoute = ({ onBack }: { onBack: () => void }) => (
  <View style={styles.container}>
    <Button
      icon="arrow-left"
      mode="contained"
      onPress={onBack}
      style={styles.backButton}
    >
      Back
    </Button>
    <Text style={styles.heading}>Add Questions</Text>
    <SetQuestions />
  </View>
);

const Teachers = () => {
  const [showSetQuestions, setShowSetQuestions] = React.useState(false);

  const handleSetTest = () => {
    setShowSetQuestions(true);
  };

  const handleBack = () => {
    setShowSetQuestions(false);
  };

  return (
    <View style={styles.container}>
      {!showSetQuestions ? (
        <SetTestRoute onSetTest={handleSetTest} />
      ) : (
        <SetQuestionsRoute onBack={handleBack} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 7,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 60, // Adjusted to prevent overlap with the back button
    marginBottom: 16,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
  },
});

export default Teachers;
