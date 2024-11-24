import * as React from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { Text, TextInput, Button, Card, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const SetQuestions = () => {
  const navigation = useNavigation();
  const [questions, setQuestions] = React.useState([
    {
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correctAnswer: "",
    },
  ]);

  const handleSetQuestion = () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (
        !q.question ||
        !q.option1 ||
        !q.option2 ||
        !q.option3 ||
        !q.option4 ||
        !q.correctAnswer
      ) {
        Alert.alert(`Please fill in all fields for Question ${i + 1}`);
        return;
      }
      const options = [q.option1, q.option2, q.option3, q.option4];
      const uniqueOptions = new Set(options);
      if (uniqueOptions.size !== options.length) {
        Alert.alert(`Options for Question ${i + 1} must be unique`);
        return;
      }
    }
    // Handle setting the question logic here
    Alert.alert("Questions Set", JSON.stringify(questions));
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        correctAnswer: "",
      },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleInputChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {questions.map((q, index) => (
          <Card key={index} style={styles.card}>
            <Card.Title
              title={`Question ${index + 1}`}
              right={(props) => (
                <IconButton
                  {...props}
                  icon="minus-circle"
                  onPress={() => handleRemoveQuestion(index)}
                />
              )}
            />
            <Card.Content>
              <Text variant="titleLarge" style={styles.label}>
                Question:
              </Text>
              <TextInput
                mode="outlined"
                style={[styles.input, styles.textArea]}
                value={q.question}
                onChangeText={(text) =>
                  handleInputChange(index, "question", text)
                }
                multiline={true}
                numberOfLines={4}
              />
              <Text variant="titleLarge" style={styles.label}>
                Option 1:
              </Text>
              <TextInput
                mode="outlined"
                style={styles.input}
                value={q.option1}
                onChangeText={(text) =>
                  handleInputChange(index, "option1", text)
                }
              />
              <Text variant="titleLarge" style={styles.label}>
                Option 2:
              </Text>
              <TextInput
                mode="outlined"
                style={styles.input}
                value={q.option2}
                onChangeText={(text) =>
                  handleInputChange(index, "option2", text)
                }
              />
              <Text variant="titleLarge" style={styles.label}>
                Option 3:
              </Text>
              <TextInput
                mode="outlined"
                style={styles.input}
                value={q.option3}
                onChangeText={(text) =>
                  handleInputChange(index, "option3", text)
                }
              />
              <Text variant="titleLarge" style={styles.label}>
                Option 4:
              </Text>
              <TextInput
                mode="outlined"
                style={styles.input}
                value={q.option4}
                onChangeText={(text) =>
                  handleInputChange(index, "option4", text)
                }
              />
              <Text variant="titleLarge" style={styles.label}>
                Correct Answer:
              </Text>
              <TextInput
                mode="outlined"
                style={styles.input}
                value={q.correctAnswer}
                onChangeText={(text) =>
                  handleInputChange(index, "correctAnswer", text)
                }
              />
            </Card.Content>
          </Card>
        ))}
        <Button
          mode="contained"
          onPress={handleAddQuestion}
          style={styles.button}
        >
          Add Question
        </Button>
        <Button
          mode="contained"
          onPress={handleSetQuestion}
          style={styles.button}
        >
          Set Questions
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100, // Ensure space for bottom navigation
  },
  card: {
    marginBottom: 16,
    marginHorizontal: 8,
  },
  label: {
    marginVertical: 4,
    fontSize: 14, // Smaller font size
  },
  input: {
    marginVertical: 4,
    fontSize: 14, // Smaller font size
  },
  textArea: {
    height: 100, // Larger height for text area
  },
  button: {
    marginTop: 16,
    marginHorizontal: 8,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 1,
  },
});

export default SetQuestions;
