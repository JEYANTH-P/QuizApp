import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Card } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TestDetails = () => {
  const route = useRoute();
  const { testId, testName, testMarks } = route.params;
  interface Question {
    questionId: string;
    questionText: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    correctAnswer: string;
    userAnswer: string;
    correct: boolean;
  }

  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [awardedMarks, setAwardedMarks] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const response = await fetch(
          `http://${process.env.EXPO_PUBLIC_SERVER_IP_ADDRESS}:8081/marks/fetch?userId=${userId}&testId=${testId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (response.ok) {
          setQuestions(data[0]);
          setAwardedMarks(data[1]);
        } else {
          Alert.alert(
            "Error",
            "Failed to fetch test details. Please try again."
          );
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        Alert.alert(
          "Error",
          "Failed to fetch questions. Please check your internet connection."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [testId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ee" />;
  }

  if (!questions.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No questions found for this test</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{testName}</Text>
      <Text style={styles.marks}>Total Marks: {testMarks}</Text>
      <Text style={styles.marks}>Percentage Awarded Marks: {awardedMarks}</Text>
      {questions.map((question, index) => (
        <Card key={question.questionId} style={styles.card}>
          <Card.Content>
            <Text style={styles.questionNumber}>Question {index + 1}</Text>
            <Text style={styles.questionText}>{question.questionText}</Text>
            {[
              question.option1,
              question.option2,
              question.option3,
              question.option4,
            ].map((option) => (
              <Card
                key={option}
                style={[
                  styles.optionCard,
                  option === question.correctAnswer && styles.correctOption,
                  option === question.userAnswer &&
                    option !== question.correctAnswer &&
                    styles.wrongOption,
                ]}
              >
                <Card.Content>
                  <Text style={styles.optionText}>{option}</Text>
                </Card.Content>
              </Card>
            ))}
            <Text style={styles.resultText}>
              {question.correct ? "Correct" : "Incorrect"}
            </Text>
            {!question.correct && (
              <Text style={styles.correctAnswerText}>
                Correct Answer: {question.correctAnswer}
              </Text>
            )}
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  marks: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
  },
  questionNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  questionText: {
    fontSize: 16,
    marginBottom: 8,
  },
  optionCard: {
    marginBottom: 8,
    borderRadius: 8,
    elevation: 3,
  },
  correctOption: {
    backgroundColor: "#d4edda", // Light green background for correct options
  },
  wrongOption: {
    backgroundColor: "#f8d7da", // Light red background for wrong options
  },
  optionText: {
    fontSize: 16,
  },
  resultText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  correctAnswerText: {
    fontSize: 16,
    color: "green",
    marginTop: 8,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});

export default TestDetails;
