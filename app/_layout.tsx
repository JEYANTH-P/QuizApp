import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack initialRouteName="index">
      
      <Stack.Screen name="index" options={{ headerShown: false }} />
      
      <Stack.Screen name="student" options={{ headerShown: false }} />
      <Stack.Screen name="questions" options={{ headerShown: false }}/>
      <Stack.Screen name="teacher" options={{ headerShown: false }} />
      <Stack.Screen name="testdetails" options={{ headerShown: false }} />
    </Stack>
  );
}