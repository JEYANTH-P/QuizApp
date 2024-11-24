import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import UpcomingTest from '@/components/upcomingtest';
import Marks from '@/components/marks';

const UpcomingTestsRoute = () => <UpcomingTest />;

const MarksRoute = () => <Marks/>;

const Student = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'upcomingTests', title: 'Upcoming Tests', focusedIcon: 'calendar', unfocusedIcon: 'calendar-outline' },
    { key: 'marks', title: 'Marks', focusedIcon: 'chart-line', unfocusedIcon: 'chart-line' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    upcomingTests: UpcomingTestsRoute,
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

export default Student;