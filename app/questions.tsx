import * as React from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Checkbox, ProgressBar, MD3Colors, RadioButton, Card, Button, Avatar } from 'react-native-paper';
import { useNavigation } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Questions = () => {
  const [agreed, setAgreed] = React.useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<{ questionId: number; answer: any; correct: boolean }[]>([]);
  const [timer, setTimer] = React.useState(30);
  const [showResults, setShowResults] = React.useState(false);
  const [testStarted, setTestStarted] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState('');
  const [questions, setQuestions] = React.useState<Array<{ questionId: number; questionText: string; option1: string; option2: string; option3: string; option4: string; correctAnswer: string }>>([]);
  const [loading, setLoading] = React.useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { testId } = route.params as { testId: string };

  React.useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://10.11.148.18:8081/questions/fetch?testId=${testId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (response.ok) {
          setQuestions(data.questions);
        } else {
          Alert.alert('Error', 'Failed to fetch questions. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        Alert.alert('Error', 'Failed to fetch questions. Please check your internet connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [testId]);

  React.useEffect(() => {
    if (testStarted && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      handleUnansweredQuestion();
      handleNextQuestion();
    }
  }, [timer, testStarted]);

  React.useEffect(() => {
    // Log the answers whenever they change
    const logAnswers = async () => {
      const userId = await AsyncStorage.getItem('userId');
      console.log('User Answers:', JSON.stringify({
        userId,
        testId,
        answers
      }, null, 2));
    };
    logAnswers();
  }, [answers]);

  const handleStart = () => {
    if (agreed) {
      setTestStarted(true);
      setTimer(30);
    } else {
      Alert.alert('Error', 'You must agree to the instructions before starting the test.');
    }
  };

  const handleAnswer = async () => {
    if (selectedOption) {
      const question = questions[currentQuestionIndex];
      if (!question) {
        Alert.alert('Error', 'Question not found.');
        return;
      }
      const correct = selectedOption === question.correctAnswer;
      const answer = { questionId: question.questionId, answer: selectedOption, correct };
      const updatedAnswers = [...answers, answer];
      setAnswers(updatedAnswers);
      setSelectedOption('');
      if (currentQuestionIndex < questions.length - 1) {
        handleNextQuestion();
      } else {
        setShowResults(true);
        sendResultsToBackend(updatedAnswers);
      }
    } else {
      Alert.alert('Error', 'You must select an answer before proceeding to the next question.');
    }
  };

  const handleUnansweredQuestion = () => {
    const question = questions[currentQuestionIndex];
    if (!question) {
      Alert.alert('Error', 'Question not found.');
      return;
    }
    const answer = { questionId: question.questionId, answer: "", correct: false };
    setAnswers(prevAnswers => [...prevAnswers, answer]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(30);
    } else {
      setShowResults(true);
      sendResultsToBackend(answers);
    }
  };

  const sendResultsToBackend = async (finalAnswers: any[]) => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      Alert.alert('Error', 'User ID not found. Please log in again.');
      return;
    }
    const formattedAnswers = finalAnswers.map(answer => ({
      questionId: answer.questionId,
      testId: parseInt(testId, 10),
      userId: parseInt(userId, 10),
      userAnswer: answer.answer,
      isCorrect: answer.correct,
    }));

    console.log('Formatted Answers:', JSON.stringify(formattedAnswers, null, 2));

    try {
      const response = await fetch('http://10.11.148.18:8081/marks/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedAnswers),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error submitting answers:', errorData);
        Alert.alert('Error', 'Failed to submit answers. Please try again.');
      } else {
        console.log('Successfully submitted answers');
        handleBackToUpcomingTests();
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
      Alert.alert('Error', 'Failed to submit answers. Please try again.');
    }
  };

  const handleBackToUpcomingTests = () => {
    // Navigate to the upcoming tests screen
    navigation.navigate('student' as never);
  };

  const renderQuestion = () => {
    const question = questions[currentQuestionIndex];
    if (!question) {
      return null;
    }
    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
    const progress = Math.floor(progressPercentage / 10) / 10;
    return (
      <View style={styles.questionContainer}>
        <ProgressBar progress={progress} color={MD3Colors.primary50} style={styles.progressBar} />
        <Text style={styles.timer}>Time left: {timer} seconds</Text>
        <Text style={styles.questionText}>{question.questionText}</Text>
        <RadioButton.Group onValueChange={value => setSelectedOption(value)} value={selectedOption}>
          <Card style={styles.optionCard} onPress={() => setSelectedOption(question.option1)}>
            <Card.Content style={styles.optionContent}>
              <RadioButton value={question.option1} />
              <Text style={styles.optionText}>{question.option1}</Text>
            </Card.Content>
          </Card>
          <Card style={styles.optionCard} onPress={() => setSelectedOption(question.option2)}>
            <Card.Content style={styles.optionContent}>
              <RadioButton value={question.option2} />
              <Text style={styles.optionText}>{question.option2}</Text>
            </Card.Content>
          </Card>
          <Card style={styles.optionCard} onPress={() => setSelectedOption(question.option3)}>
            <Card.Content style={styles.optionContent}>
              <RadioButton value={question.option3} />
              <Text style={styles.optionText}>{question.option3}</Text>
            </Card.Content>
          </Card>
          <Card style={styles.optionCard} onPress={() => setSelectedOption(question.option4)}>
            <Card.Content style={styles.optionContent}>
              <RadioButton value={question.option4} />
              <Text style={styles.optionText}>{question.option4}</Text>
            </Card.Content>
          </Card>
        </RadioButton.Group>
        <Button mode="contained" onPress={handleAnswer} style={styles.submitButton}>
          Submit Answer
        </Button>
      </View>
    );
  };

  const renderResults = () => {
    const answeredCount = answers.filter(answer => answer.answer !== "").length;
    const unansweredCount = questions.length - answeredCount;
    const allQuestions = Array.from({ length: questions.length }, (_, index) => index);
    const completeAnswers = allQuestions.map((questionIndex) => {
      const question = questions[questionIndex];
      const answer = answers.find(a => a.questionId === question.questionId);
      return answer ? answer : { questionId: question.questionId, answer: "", correct: false };
    });

    return (
      <View>
        <Text style={styles.resultsTitle}>Results</Text>
        <View style={styles.resultsContainer}>
          {completeAnswers.map((answer, index) => (
            <Avatar.Text
              key={index}
              size={40}
              label={`${index + 1}`}
              style={answer.answer ? styles.answered : styles.unanswered}
            />
          ))}
        </View>
        <Text style={styles.answer}>Answered: {answeredCount}</Text>
        <Text style={styles.unanswer}>Unanswered: {unansweredCount}</Text>
        <Button mode="contained" onPress={handleBackToUpcomingTests} style={styles.backButton}>
          Back 
        </Button>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#6200ee" />;
  }

  return (
    <View style={styles.container}>
      {!testStarted && !showResults ? (
        <>
          <Text style={styles.title}>Test Instructions {testId}</Text>
          <Text style={styles.instructions}>
            1. Each question has a 30-second timer.
            {'\n'}2. You cannot reattempt the test after the window closes.
            {'\n'}3. You cannot go back to previous questions.
          </Text>
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={agreed ? 'checked' : 'unchecked'}
              onPress={() => setAgreed(!agreed)}
            />
            <Text style={styles.label}>I agree to the instructions</Text>
          </View>
          <Button mode="contained" onPress={handleStart} style={styles.startButton}>
            Start Test
          </Button>
        </>
      ) : !showResults ? (
        renderQuestion()
      ) : (
        renderResults()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    textAlign: 'center',
  },
  questionContainer: {
    width: '100%',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  instructions: {
    fontSize: 16,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  label: {
    marginLeft: 8,
    fontSize: 16,
  },
  questionText: {
    fontSize: 22, // Increased font size for question text
    fontWeight: 'bold', // Added bold font weight
    marginBottom: 16,
    textAlign: 'center', // Centered the text
  },
  optionCard: {
    marginVertical: 12, // Increased margin for options
    backgroundColor: '#f0f0f0', // Pale blue background color
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15, // Increased padding for options
  },
  optionText: {
    fontSize: 18, // Increased font size for option text
  },
  timer: {
    marginTop: 16,
    marginBottom: 30,
    fontSize: 18, // Increased font size for timer
    color: 'red',
    textAlign: 'center',
  },
  progressBar: {
    marginTop: -24,
    marginBottom: 16, // Added margin bottom for space
    width: '100%',
  },
  submitButton: {
    marginTop: 24,
  },
  startButton: {
    marginTop: 16,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Center the grid
    gap: 16, // Spacing between avatars
    width: '70%',
  },
  resultCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 8, // Spacing between avatars
    justifyContent: 'center', // Center text vertically
    alignItems: 'center', // Center text horizontally
  },
  answered: {
    backgroundColor: 'green',
    textAlign: 'center',
  },
  unanswered: {
    backgroundColor: 'red',
    textAlign: 'center',
  },
  answer: {
    marginTop: 100,
    textAlign: "center",
    fontSize: 16,
    fontWeight: '600'
  },
  unanswer: {
    marginTop: 10,
    fontWeight: '600',
    textAlign: "center"
  },
  backButton: {
    marginTop: 20,
  },
});

export default Questions;


