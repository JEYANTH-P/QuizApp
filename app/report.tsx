import * as React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { DataTable, Text, Button } from 'react-native-paper';
import { useSearchParams } from 'expo-router/build/hooks';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const Report = () => {
  const searchParams = useSearchParams();
  const testId = searchParams.get('testId');
  const testName = searchParams.get('testName');

  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([14, 10]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );

  const [students, setStudents] = React.useState([
    { "no": 1, "email": "2022115001@student.annauniv.edu", "marks": 85 },
    { "no": 2, "email": "2022115002@student.annauniv.edu", "marks": 90 },
    { "no": 3, "email": "2022115003@student.annauniv.edu", "marks": 78 },
    { "no": 4, "email": "2022115004@student.annauniv.edu", "marks": 88 },
    { "no": 5, "email": "2022115005@student.annauniv.edu", "marks": 92 },
    { "no": 6, "email": "2022115006@student.annauniv.edu", "marks": 75 },
    { "no": 7, "email": "2022115007@student.annauniv.edu", "marks": 80 },
    { "no": 8, "email": "2022115008@student.annauniv.edu", "marks": 85 },
    { "no": 9, "email": "2022115009@student.annauniv.edu", "marks": 89 },
    { "no": 10, "email": "2022115010@student.annauniv.edu", "marks": 95 },
    { "no": 11, "email": "2022115011@student.annauniv.edu", "marks": 70 },
    { "no": 12, "email": "2022115012@student.annauniv.edu", "marks": 88 },
    { "no": 13, "email": "2022115013@student.annauniv.edu", "marks": 77 },
    { "no": 14, "email": "2022115014@student.annauniv.edu", "marks": 82 },
    { "no": 15, "email": "2022115015@student.annauniv.edu", "marks": 91 },
    { "no": 16, "email": "2022115016@student.annauniv.edu", "marks": 84 },
    { "no": 17, "email": "2022115017@student.annauniv.edu", "marks": 79 },
    { "no": 18, "email": "2022115018@student.annauniv.edu", "marks": 87 },
    { "no": 19, "email": "2022115019@student.annauniv.edu", "marks": 93 },
    { "no": 20, "email": "2022115020@student.annauniv.edu", "marks": 76 },
    { "no": 21, "email": "2022115021@student.annauniv.edu", "marks": 81 },
    { "no": 22, "email": "2022115022@student.annauniv.edu", "marks": 85 },
    { "no": 23, "email": "2022115023@student.annauniv.edu", "marks": 90 },
    { "no": 24, "email": "2022115024@student.annauniv.edu", "marks": 78 },
    { "no": 25, "email": "2022115025@student.annauniv.edu", "marks": 88 },
    { "no": 26, "email": "2022115026@student.annauniv.edu", "marks": 92 },
    { "no": 27, "email": "2022115027@student.annauniv.edu", "marks": 75 },
    { "no": 28, "email": "2022115028@student.annauniv.edu", "marks": 80 },
    { "no": 29, "email": "2022115029@student.annauniv.edu", "marks": 85 },
    { "no": 30, "email": "2022115030@student.annauniv.edu", "marks": 89 },
    { "no": 31, "email": "2022115031@student.annauniv.edu", "marks": 95 },
    { "no": 32, "email": "2022115032@student.annauniv.edu", "marks": 70 },
    { "no": 33, "email": "2022115033@student.annauniv.edu", "marks": 88 },
    { "no": 34, "email": "2022115034@student.annauniv.edu", "marks": 77 },
    { "no": 35, "email": "2022115035@student.annauniv.edu", "marks": 82 },
    { "no": 36, "email": "2022115036@student.annauniv.edu", "marks": 91 },
    { "no": 37, "email": "2022115037@student.annauniv.edu", "marks": 84 },
    { "no": 38, "email": "2022115038@student.annauniv.edu", "marks": 79 },
    { "no": 39, "email": "2022115039@student.annauniv.edu", "marks": 87 },
    { "no": 40, "email": "2022115040@student.annauniv.edu", "marks": 93 },
    { "no": 41, "email": "2022115041@student.annauniv.edu", "marks": 76 },
    { "no": 42, "email": "2022115042@student.annauniv.edu", "marks": 81 },
    { "no": 43, "email": "2022115043@student.annauniv.edu", "marks": 85 },
    { "no": 44, "email": "2022115044@student.annauniv.edu", "marks": 90 },
    { "no": 45, "email": "2022115045@student.annauniv.edu", "marks": 78 },
    { "no": 46, "email": "2022115046@student.annauniv.edu", "marks": 88 },
    { "no": 47, "email": "2022115047@student.annauniv.edu", "marks": 92 },
    { "no": 48, "email": "2022115048@student.annauniv.edu", "marks": 75 },
    { "no": 49, "email": "2022115049@student.annauniv.edu", "marks": 80 },
    { "no": 50, "email": "2022115050@student.annauniv.edu", "marks": 85 },
    { "no": 51, "email": "2022115051@student.annauniv.edu", "marks": 89 },
    { "no": 52, "email": "2022115052@student.annauniv.edu", "marks": 95 },
    { "no": 53, "email": "2022115053@student.annauniv.edu", "marks": 70 },
    { "no": 54, "email": "2022115054@student.annauniv.edu", "marks": 88 },
    { "no": 55, "email": "2022115055@student.annauniv.edu", "marks": 77 },
    { "no": 56, "email": "2022115056@student.annauniv.edu", "marks": 82 },
    { "no": 57, "email": "2022115057@student.annauniv.edu", "marks": 91 },
    { "no": 58, "email": "2022115058@student.annauniv.edu", "marks": 84 },
    { "no": 59, "email": "2022115059@student.annauniv.edu", "marks": 79 },
    { "no": 60, "email": "2022115060@student.annauniv.edu", "marks": 87 },
    { "no": 61, "email": "2022115061@student.annauniv.edu", "marks": 93 },
    { "no": 62, "email": "2022115062@student.annauniv.edu", "marks": 76 },
    { "no": 63, "email": "2022115063@student.annauniv.edu", "marks": 81 },
    { "no": 64, "email": "2022115064@student.annauniv.edu", "marks": 85 }
  ]);

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, students.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const downloadCSV = async () => {
    const csvContent = [
      ['No', 'Student Email', 'Marks Obtained'],
      ...students.map(student => [student.no, student.email, student.marks])
    ]
      .map(e => e.join(','))
      .join('\n');

    const fileUri = FileSystem.documentDirectory + 'report.csv';
    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    await Sharing.shareAsync(fileUri);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report for {testName}</Text>
      <ScrollView horizontal>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>No</DataTable.Title>
            <DataTable.Title>Student Email</DataTable.Title>
            <DataTable.Title numeric>Marks Obtained</DataTable.Title>
          </DataTable.Header>

          {students.slice(from, to).map((student) => (
            <DataTable.Row key={student.no}>
              <DataTable.Cell>{student.no}</DataTable.Cell>
              <DataTable.Cell>{student.email}</DataTable.Cell>
              <DataTable.Cell numeric>{student.marks}</DataTable.Cell>
            </DataTable.Row>
          ))}

          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(students.length / itemsPerPage)}
            onPageChange={(page) => setPage(page)}
            label={`${from + 1}-${to} of ${students.length}`}
            numberOfItemsPerPageList={numberOfItemsPerPageList}
            numberOfItemsPerPage={itemsPerPage}
            onItemsPerPageChange={onItemsPerPageChange}
            showFastPaginationControls
            selectPageDropdownLabel={'Rows per page'}
            style={styles.pagination}
          />
        </DataTable>
      </ScrollView>
      <Button mode="contained" onPress={downloadCSV} style={styles.downloadButton}>
        Download Report as CSV
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    color: '#6200ee',
    fontWeight: 'bold',
  },
  pagination: {
    justifyContent: 'center',
  },
  downloadButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
});

export default Report;