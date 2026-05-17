import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet } from "react-native";
import CameraScreen from "./src/screens/CamaraScreens";
import { DatabaseService } from "./src/services/database";

export default function App() {
  //Data base initialized
  useEffect(() => {
    const setup = async () => {
      await DatabaseService.initDatabase();
    };
    setup();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <CameraScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
});
