import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Card } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const sampleData = {
  awardedMarks: 90,
  questions: [
    {
      questionId: 1,
      questionText: "What is the capital of France?",
      option1: "Berlin",
      option2: "Madrid",
      option3: "Paris",
      option4: "Rome",
      correctAnswer: "Paris",
      userAnsweredOption: "Madrid",
    },
    {
      questionId: 2,
      questionText: "What is 2 + 2?",
      option1: "3",
      option2: "4",
      option3: "5",
      option4: "6",
      correctAnswer: "4",
      userAnsweredOption: "4",
    },
    {
      questionId: 3,
      questionText: "Which planet is known as the Red Planet?",
      option1: "Earth",
      option2: "Mars",
      option3: "Jupiter",
      option4: "Saturn",
      correctAnswer: "Mars",
      userAnsweredOption: "Jupiter",
    },
    {
      questionId: 4,
      questionText: "What is the largest ocean on Earth?",
      option1: "Atlantic Ocean",
      option2: "Indian Ocean",
      option3: "Arctic Ocean",
      option4: "Pacific Ocean",
      correctAnswer: "Pacific Ocean",
      userAnsweredOption: "Indian Ocean",
    },
    {
      questionId: 5,
      questionText: "Who wrote 'Romeo and Juliet'?",
      option1: "William Shakespeare",
      option2: "Charles Dickens",
      option3: "Mark Twain",
      option4: "Jane Austen",
      correctAnswer: "William Shakespeare",
      userAnsweredOption: "Mark Twain",
    },
    {
      questionId: 6,
      questionText: "What is the chemical symbol for water?",
      option1: "H2O",
      option2: "O2",
      option3: "CO2",
      option4: "NaCl",
      correctAnswer: "H2O",
      userAnsweredOption: "H2O",
    },
    {
      questionId: 7,
      questionText: "What is the square root of 64?",
      option1: "6",
      option2: "7",
      option3: "8",
      option4: "9",
      correctAnswer: "8",
      userAnsweredOption: "9",
    },
    {
      questionId: 8,
      questionText: "Who painted the Mona Lisa?",
      option1: "Vincent van Gogh",
      option2: "Pablo Picasso",
      option3: "Leonardo da Vinci",
      option4: "Claude Monet",
      correctAnswer: "Leonardo da Vinci",
      userAnsweredOption: "Leonardo da Vinci",
    },
    {
      questionId: 9,
      questionText: "What is the smallest prime number?",
      option1: "0",
      option2: "1",
      option3: "2",
      option4: "3",
      correctAnswer: "2",
      userAnsweredOption: "3",
    },
  ],
};

const TestDetails = () => {
  const route = useRoute();
  const { testId, testName, testMarks } = route.params;
  const [questions, setQuestions] = React.useState([]);
  const [awardedMarks, setAwardedMarks] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Simulate fetching questions for the test
        const data = sampleData;
        setQuestions(data.questions);
        setAwardedMarks(data.awardedMarks);
      } catch (error) {
        console.error('Error fetching questions:', error);
        Alert.alert('Error', 'Failed to fetch questions. Please check your internet connection.');
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
      <Text style={styles.marks}>Awarded Marks: {awardedMarks}</Text>
      {questions.map((question, index) => (
        <Card key={question.questionId} style={styles.card}>
          <Card.Content>
            <Text style={styles.questionNumber}>Question {index + 1}</Text>
            <Text style={styles.questionText}>{question.questionText}</Text>
            {[question.option1, question.option2, question.option3, question.option4].map(option => (
              <Card
                key={option}
                style={[
                  styles.optionCard,
                  option === question.correctAnswer && styles.correctOption,
                  option === question.userAnsweredOption && option !== question.correctAnswer && styles.wrongOption,
                ]}
              >
                <Card.Content>
                  <Text style={styles.optionText}>{option}</Text>
                </Card.Content>
              </Card>
            ))}
            <Text style={styles.resultText}>
              {question.userAnsweredOption === question.correctAnswer ? 'Correct' : 'Incorrect'}
            </Text>
            {question.userAnsweredOption !== question.correctAnswer && (
              <Text style={styles.correctAnswerText}>Correct Answer: {question.correctAnswer}</Text>
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
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  marks: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
  },
  questionNumber: {
    fontSize: 18,
    fontWeight: 'bold',
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
    backgroundColor: '#d4edda', // Light green background for correct options
  },
  wrongOption: {
    backgroundColor: '#f8d7da', // Light red background for wrong options
  },
  optionText: {
    fontSize: 16,
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  correctAnswerText: {
    fontSize: 16,
    color: 'green',
    marginTop: 8,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default TestDetails;