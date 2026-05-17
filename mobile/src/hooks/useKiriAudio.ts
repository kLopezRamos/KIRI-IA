import { useEffect, useRef } from "react";
import { Audio } from "expo-av";
import { KiriService } from "../services/api";

export function useKiriAudio() {
  const soundRef = useRef<Audio.Sound | null>(null);

  // Inicializar modo de audio para iOS (Incluso en modo silencio)
  useEffect(() => {
    const configurarAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          interruptionModeIOS: 1, // InterruptionModeIOS.DoNotMix
        });
        console.log("Configuración de audio de iOS aplicada con éxito.");
      } catch (error) {
        console.error("Error al configurar el modo de audio:", error);
      }
    };

    configurarAudio();

    // Limpieza automática cuando el componente se desmonte
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // Función dedicada a descargar y sonar el .mp3
  const reproducirPronunciacion = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      const audioUrl = KiriService.getAudioUrl();
      console.log("Descargando audio desde:", audioUrl);

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );

      soundRef.current = sound;
    } catch (audioError) {
      console.error("Error al reproducir el audio en el iPhone:", audioError);
    }
  };

  return { reproducirPronunciacion };
}