import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Audio } from "expo-av";
import { KiriService } from "../services/api";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<any>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  //Sound enabled
  React.useEffect(() => {
    const configurarAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          interruptionModeIOS: 1,
        });
        console.log("Configuración de audio de iOS aplicada con éxito.");
      } catch (error) {
        console.error("Error al configurar el modo de audio:", error);
      }
    };

    configurarAudio();
  }, []);

  if (!permission) return <View style={styles.container} />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Kiri AI necesita acceso a tu cámara.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Conceder Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const reproducirPronunciacion = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      const audioUrl = KiriService.getAudioUrl();
      console.log("Descargando audio desde:", audioUrl);

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true },
      );

      soundRef.current = sound;
    } catch (audioError) {
      console.error("Error al reproducir el audio en el iPhone:", audioError);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current && !loading) {
      try {
        setLoading(true);
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
        });

        if (photo?.uri) {
          console.log("Foto capturada:", photo.uri);

          const result = await KiriService.predictObject(photo.uri);
          console.log("Resultado del servidor:", result);

          await reproducirPronunciacion();

          Alert.alert("¡Éxito!", `Detectado: ${result.object}`);
        }
      } catch (error) {
        console.error("Error completo:", error);
        Alert.alert(
          "Error",
          "El servidor respondió con un error o hubo un timeout.",
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#00ff00" />
          ) : (
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <View style={styles.innerCaptureButton} />
            </TouchableOpacity>
          )}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", backgroundColor: "#1A1A1A" },
  camera: { flex: 1, justifyContent: "flex-end" },
  text: { textAlign: "center", color: "#fff", marginBottom: 20 },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignSelf: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
  },
  captureButton: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  innerCaptureButton: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: "#fff",
  },
});
