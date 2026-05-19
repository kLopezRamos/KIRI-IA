import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // <-- Importamos los iconos
import { useKiriHistory } from "../hooks/useKiriHistory";
import { useKiriAudio } from "../hooks/useKiriAudio";
import { HistoryItem } from "../services/database";

export default function HistoryScreen() {
  const { historyItems, loading, recargarHistorial } = useKiriHistory();
  const { reproducirPronunciacion } = useKiriAudio();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const abrirImagenGrande = (uri: string) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => abrirImagenGrande(item.imageUri)}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.imageUri }} style={styles.image} />
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.objectName}>{item.objectName}</Text>
        <Text style={styles.date}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => reproducirPronunciacion(item.objectName)}
        activeOpacity={0.7}
        style={styles.audioButton}
      >
        {/* Cambiado el emoji por un icono nativo de bocina */}
        <Ionicons name="volume-medium" size={24} color="#00ff00" />
      </TouchableOpacity>
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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons name="refresh" size={16} color="#00ff00" />
            <Text style={styles.refreshText}>Update</Text>
          </View>
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackgroundClose}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalContent}>
            {selectedImage && (
              <Image source={{ uri: selectedImage }} style={styles.fullImage} />
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <Ionicons name="close-circle" size={20} color="#fff" />
                <Text style={styles.closeButtonText}>Close</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  refreshButton: {
    backgroundColor: "#333",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  refreshText: { color: "#00ff00", fontSize: 14, fontWeight: "bold" },
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
  audioButton: { padding: 8, marginRight: 5 },
  emptyText: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 40,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackgroundClose: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    width: "90%",
    height: "70%",
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  fullImage: {
    width: "100%",
    flex: 1,
    resizeMode: "contain",
    backgroundColor: "#000",
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  closeButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
