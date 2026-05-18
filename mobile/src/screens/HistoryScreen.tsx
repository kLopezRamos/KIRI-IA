import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useKiriHistory } from "../hooks/useKiriHistory";
import { HistoryItem } from "../services/database";

export default function HistoryScreen() {
  // Consumimos los datos de SQLite a través de nuestro hook
  const { historyItems, loading, recargarHistorial } = useKiriHistory();

  // Diseño individual para cada tarjeta del historial
  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUri }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.objectName}>{item.objectName}</Text>
        <Text style={styles.date}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  if (loading && historyItems.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Pics</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={recargarHistorial}
        >
          <Text style={styles.refreshText}>🔄 Update</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={historyItems}
        keyExtractor={(item) => item.id?.toString() || String(Math.random())}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            There are so many objects yet to discover!
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1A1A1A", paddingTop: 20 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  refreshButton: { backgroundColor: "#333", padding: 8, borderRadius: 8 },
  refreshText: { color: "#00ff00", fontSize: 14 },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  card: {
    flexDirection: "row",
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    alignItems: "center",
    padding: 10,
  },
  image: { width: 70, height: 70, borderRadius: 8, backgroundColor: "#444" },
  infoContainer: { flex: 1, marginLeft: 15 },
  objectName: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  date: { fontSize: 12, color: "#aaa", marginTop: 4 },
  emptyText: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 40,
    fontSize: 16,
  },
});
