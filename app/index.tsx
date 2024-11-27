import { Text, View } from "react-native";
import Login from "@/components/login";
import { useNotification } from "@/context/notificationContext";

export default function Index() {
  const {expoPushToken,notification,error} = useNotification();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Login />
    </View>
  );
}