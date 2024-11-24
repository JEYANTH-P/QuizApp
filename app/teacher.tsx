import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Teacher() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome, Teacher!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 24,
    color: "#6200ee",
  },
});