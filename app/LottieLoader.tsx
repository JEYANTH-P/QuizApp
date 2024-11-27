import * as React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import LottieView from "lottie-react-native";

const LottieLoader = () => {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("../assets/Animation - 1732700303072.json")} // Adjust the path as needed
        autoPlay
        loop
        style={styles.lottie}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
    zIndex: 1000, // Ensure it is on top of other elements
  },
  lottie: {
    width: Dimensions.get("window").width * 0.5,
    height: Dimensions.get("window").width * 0.5,
  },
});

export default LottieLoader;
