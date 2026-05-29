import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, StatusBar, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
// Importamos tus componentes modulares
import CameraScreen from "./src/screens/CamaraScreens";
import HistoryScreen from "./src/screens/HistoryScreen";
import PracticeScreen from "./src/screens/PracticeScreen";
import { DatabaseService } from "./src/services/database";

// Inicializamos el creador de pestañas nativas
const Tab = createBottomTabNavigator();

export default function App() {
  // Inicializamos la base de datos local al arrancar
  useEffect(() => {
    const setupDb = async () => {
      await DatabaseService.initDatabase();
    };
    setupDb();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A1A" />

      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: "#2A2A2A",
              borderTopColor: "#333",
              paddingBottom: 5,
              height: 60,
            },
            tabBarActiveTintColor: "#00ff00",
            tabBarInactiveTintColor: "#aaa",
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "bold",
            },
          }}
        >
          {/* Pestaña 1: Cámara */}
          <Tab.Screen
            name="Camera"
            component={CameraScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="camera" size={size} color={color} />
              ),
            }}
          />

          {/* Pestaña 2: Historial */}
          <Tab.Screen
            name="Objects"
            component={HistoryScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="folder-open" size={size} color={color} />
              ),
            }}
          />

          {/* Pestaña 3: Práctica */}
          <Tab.Screen
            name="Game"
            component={PracticeScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="game-controller" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
});
