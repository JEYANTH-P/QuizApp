import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';
import SetTest from '@/components/SetTest';
import Marks from '@/components/viewmarks';
import Enroll from '@/components/enroll' // Assuming you have an Enroll component

const QuestionsRoute = () =>  <SetTest/>;
const EnrollRoute = () => <Enroll />;
const MarksRoute = () => <Marks />;

const Teacher = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'questions', title: 'Questions', focusedIcon: 'book', unfocusedIcon: 'book-outline' },
    { key: 'enroll', title: 'Enroll', focusedIcon: 'account-multiple', unfocusedIcon: 'account-multiple-outline' },
    { key: 'marks', title: 'Marks', focusedIcon: 'chart-line', unfocusedIcon: 'chart-line' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    questions: QuestionsRoute,
    enroll: EnrollRoute,
    marks: MarksRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default Teacher;