import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons"; // <-- Iconos nativos
import { useKiriHistory } from "../hooks/useKiriHistory";
import { useKiriAudio } from "../hooks/useKiriAudio";
import { HistoryItem } from "../services/database";

export default function PracticeScreen() {
  const { historyItems, loading, recargarHistorial } = useKiriHistory();
  const { reproducirPronunciacion } = useKiriAudio();

  const [currentItem, setCurrentItem] = useState<HistoryItem | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const iniciarNuevoJuego = () => {
    if (historyItems.length > 0) {
      const randomIndex = Math.floor(Math.random() * historyItems.length);
      const item = historyItems[randomIndex];
      setCurrentItem(item);
      setRevealed(false);
      setHasPlayed(true);

      setTimeout(() => {
        reproducirPronunciacion(item.objectName);
      }, 300);
    }
  };

  useEffect(() => {
    recargarHistorial();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  if (historyItems.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons
          name="images-outline"
          size={50}
          color="#666"
          style={{ marginBottom: 15 }}
        />
        <Text style={styles.emptyText}>
          Scan some objects in the camera tab first to unlock the game!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginBottom: 5,
        }}
      >
        <Text style={styles.title}>Listen & Guess!</Text>
        <Ionicons name="headset" size={28} color="#00ff00" />
      </View>
      <Text style={styles.subtitle}>
        Train your ears! Can you guess the object?
      </Text>

      {!hasPlayed ? (
        <View style={styles.gameBox}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={iniciarNuevoJuego}
          >
            <View style={styles.btnContentRow}>
              <Ionicons name="play-circle" size={24} color="#000" />
              <Text style={styles.startButtonText}>Start Game</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.gameBox}>
          <View style={styles.imageContainer}>
            {revealed ? (
              <Image
                source={{ uri: currentItem?.imageUri }}
                style={styles.image}
              />
            ) : (
              <View style={[styles.image, styles.mysteryBox]}>
                <Ionicons name="help-circle-outline" size={100} color="#555" />
              </View>
            )}
          </View>

          {revealed ? (
            <View style={styles.resultContainer}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <Ionicons name="sparkles" size={18} color="#00ff00" />
                <Text style={styles.congratsText}>It's a...</Text>
              </View>
              <Text style={styles.objectName}>{currentItem?.objectName}</Text>
            </View>
          ) : (
            <Text style={styles.hiddenText}>
              Listen carefully to the sound...
            </Text>
          )}

          <View style={styles.actionRow}>
            {/* Replay Sound */}
            <TouchableOpacity
              style={styles.audioButton}
              onPress={() =>
                currentItem && reproducirPronunciacion(currentItem.objectName)
              }
            >
              <View style={styles.btnContentRow}>
                <Ionicons name="volume-high" size={20} color="#fff" />
                <Text style={styles.btnText}>Replay Sound</Text>
              </View>
            </TouchableOpacity>

            {/* Reveal o Next */}
            {!revealed ? (
              <TouchableOpacity
                style={styles.revealButton}
                onPress={() => setRevealed(true)}
              >
                <View style={styles.btnContentRow}>
                  <Ionicons name="eye" size={20} color="#000" />
                  <Text style={[styles.btnText, { color: "#000" }]}>
                    Reveal
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={iniciarNuevoJuego}
              >
                <View style={styles.btnContentRow}>
                  <MaterialIcons name="navigate-next" size={24} color="#fff" />
                  <Text style={styles.btnText}>Next Object</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00ff00",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 30,
    textAlign: "center",
  },
  gameBox: {
    width: "100%",
    flex: 1,
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  imageContainer: {
    width: 220,
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 25,
    borderWidth: 2,
    borderColor: "#333",
  },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  mysteryBox: {
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  hiddenText: {
    fontSize: 16,
    color: "#888",
    fontStyle: "italic",
    marginBottom: 25,
  },
  resultContainer: { alignItems: "center", marginBottom: 25 },
  congratsText: { fontSize: 16, color: "#00ff00", fontWeight: "bold" },
  objectName: { fontSize: 26, fontWeight: "bold", color: "#fff", marginTop: 5 },
  actionRow: { width: "100%", flexDirection: "column", gap: 12 },
  startButton: {
    backgroundColor: "#00ff00",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  startButtonText: { color: "#000", fontSize: 18, fontWeight: "bold" },
  audioButton: {
    backgroundColor: "#444",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  revealButton: {
    backgroundColor: "#00ff00",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  btnContentRow: { flexDirection: "row", alignItems: "center", gap: 8 }, // Fila alineada para icono + texto
  emptyText: {
    color: "#aaa",
    fontSize: 18,
    textAlign: "center",
    lineHeight: 26,
  },
});
