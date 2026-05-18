import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, StatusBar, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Importamos tus componentes modulares
import CameraScreen from "./src/screens/CamaraScreens";
import HistoryScreen from "./src/screens/HistoryScreen";
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
            headerShown: false, // Oculta la barra superior fea por defecto
            tabBarStyle: {
              backgroundColor: "#2A2A2A", // Fondo oscuro alineado a tu paleta
              borderTopColor: "#333",
              paddingBottom: 5,
              height: 60,
            },
            tabBarActiveTintColor: "#00ff00", // Verde neón cuando esté seleccionado
            tabBarInactiveTintColor: "#aaa", // Gris claro cuando esté inactivo
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "bold",
            },
          }}
        >
          {/* Pestaña 1: Cámara */}
          <Tab.Screen
            name="Cámara"
            component={CameraScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Text style={{ color, fontSize: 20 }}>📷</Text>
              ),
            }}
          />

          {/* Pestaña 2: Historial */}
          <Tab.Screen
            name="Historial"
            component={HistoryScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <Text style={{ color, fontSize: 20 }}>📂</Text>
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
