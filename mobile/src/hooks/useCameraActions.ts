import { useState } from "react";
import { Alert } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import { KiriService } from "../services/api";
import { DatabaseService } from "../services/database";
import { useKiriAudio } from "./useKiriAudio";

const PHOTO_QUALITY = 0.8;
const TEXTS = {
  errorTitle: "Error",
  errorMessage: "El servidor respondió con un error o hubo un timeout.",
  successTitle: "¡Éxito!",
};

export function useCameraActions(cameraRef: React.RefObject<any>) {
  const [loading, setLoading] = useState(false);
  const { reproducirPronunciacion } = useKiriAudio();

  const takePicture = async () => {
    if (!cameraRef.current || loading) return;

    try {
      setLoading(true);
      
      // 1. Capturar la foto desde el hardware
      const photo = await cameraRef.current.takePictureAsync({
        quality: PHOTO_QUALITY,
      });

      if (!photo?.uri) return;
      console.log("Foto temporal capturada:", photo.uri);

      // 2. Enviar a tu servidor Flask
      const result = await KiriService.predictObject(photo.uri);
      console.log("Resultado del servidor:", result);

      const filename = photo.uri.split("/").pop() || `img_${Date.now()}.jpg`;
      const permanentDirectory = `${FileSystem.documentDirectory}kiri_photos/`;
      const permanentUri = `${permanentDirectory}${filename}`;

      // Verificar si la carpeta física existe en el almacenamiento del celular, si no, crearla
      const dirInfo = await FileSystem.getInfoAsync(permanentDirectory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(permanentDirectory, { intermediates: true });
      }

      // Copiar la foto real a su ubicación permanente
      await FileSystem.copyAsync({ from: photo.uri, to: permanentUri });
      console.log("Foto guardada permanentemente en:", permanentUri);

      // 4. Guardar los datos estructurados en tu base de datos de SQLite
      await DatabaseService.insertHistory({
        objectName: result.object,
        imageUri: permanentUri,
        timestamp: new Date().toISOString(),
      });

      // 5. Reproducir el audio nativo de gTTS
      await reproducirPronunciacion();

      Alert.alert(TEXTS.successTitle, `Detectado: ${result.object}`);
    } catch (error) {
      console.error("Error en el flujo operativo de la cámara:", error);
      Alert.alert(TEXTS.errorTitle, TEXTS.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { loading, takePicture };
}