import { Stack } from "expo-router";
import { Provider as PaperProvider } from 'react-native-paper';
import { useEffect, useState } from 'react';
import { NotificationProvider } from "@/context/notificationContext";
import LottieLoader from './LottieLoader'; // Adjust the import path as needed
import * as Notifications from "expo-notifications";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setLoading(false);
    };

    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);
  
  const theme = {
    "colors": {
      "primary": "rgb(120, 69, 172)",
      "onPrimary": "rgb(255, 255, 255)",
      "primaryContainer": "rgb(240, 219, 255)",
      "onPrimaryContainer": "rgb(44, 0, 81)",
      "secondary": "rgb(102, 90, 111)",
      "onSecondary": "rgb(255, 255, 255)",
      "secondaryContainer": "rgb(237, 221, 246)",
      "onSecondaryContainer": "rgb(33, 24, 42)",
      "tertiary": "rgb(128, 81, 88)",
      "onTertiary": "rgb(255, 255, 255)",
      "tertiaryContainer": "rgb(255, 217, 221)",
      "onTertiaryContainer": "rgb(50, 16, 23)",
      "error": "rgb(186, 26, 26)",
      "onError": "rgb(255, 255, 255)",
      "errorContainer": "rgb(255, 218, 214)",
      "onErrorContainer": "rgb(65, 0, 2)",
      "background": "rgb(255, 251, 255)",
      "onBackground": "rgb(29, 27, 30)",
      "surface": "rgb(255, 251, 255)",
      "onSurface": "rgb(29, 27, 30)",
      "surfaceVariant": "rgb(233, 223, 235)",
      "onSurfaceVariant": "rgb(74, 69, 78)",
      "outline": "rgb(124, 117, 126)",
      "outlineVariant": "rgb(204, 196, 206)",
      "shadow": "rgb(0, 0, 0)",
      "scrim": "rgb(0, 0, 0)",
      "inverseSurface": "rgb(50, 47, 51)",
      "inverseOnSurface": "rgb(245, 239, 244)",
      "inversePrimary": "rgb(220, 184, 255)",
      "elevation": {
        "level0": "transparent",
        "level1": "rgb(248, 242, 251)",
        "level2": "rgb(244, 236, 248)",
        "level3": "rgb(240, 231, 246)",
        "level4": "rgb(239, 229, 245)",
        "level5": "rgb(236, 226, 243)"
      },
      "surfaceDisabled": "rgba(29, 27, 30, 0.12)",
      "onSurfaceDisabled": "rgba(29, 27, 30, 0.38)",
      "backdrop": "rgba(51, 47, 55, 0.4)"
    }
  }
  return (
    <NotificationProvider>
    <PaperProvider theme={theme}>
      <Stack initialRouteName="index">
        <Stack.Screen name="student" options={{ headerShown: false }} />
        <Stack.Screen name="questions" options={{ headerShown: false }} />
        <Stack.Screen name="teacher" options={{ headerShown: false }} />
        <Stack.Screen name="testdetails" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="SetQuestions" options={{ headerShown: false }} />
        <Stack.Screen name="report" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
    </NotificationProvider>
  );
}