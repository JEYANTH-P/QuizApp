import React from "react";
import { View, ScrollView, Alert, StyleSheet } from "react-native";
import { Card, Text, TextInput, Button, IconButton } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";

const SetQuestions = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { testName } = route.params as { testName: string };

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

  const handleSetQuestion = async () => {
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

    const formattedQuestions = questions.map((q) => ({
      questionText: q.question,
      option1: q.option1,
      option2: q.option2,
      option3: q.option3,
      option4: q.option4,
      correctAnswer: q.correctAnswer,
    }));

    try {
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_SERVER_IP_ADDRESS}:8081/questions/add?testName=${encodeURIComponent(
          testName
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formattedQuestions),
        }
      );

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (response.ok) {
        Alert.alert("Success", "Questions submitted successfully");
      } else {
        Alert.alert("Error", data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    }

    try {
      const notificationData = {
        token: "ExponentPushToken[4iuQR9PHQHxbtNlFJA1zsx]",
        title: "Quiz Posted",
        body: `${testName} has been created. Login into your account for more details`,
      };
    
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_SERVER_IP_ADDRESS}:8081/notifications/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notificationData),
        }
      );
    
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};
    
      if (response.ok) {
        Alert.alert("Success", "Notification sent successfully");
      } else {
        Alert.alert("Error", data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    }
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

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  type QuestionField =
    | "question"
    | "option1"
    | "option2"
    | "option3"
    | "option4"
    | "correctAnswer";

  const handleInputChange = (
    index: number,
    field: QuestionField,
    value: string
  ) => {
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
