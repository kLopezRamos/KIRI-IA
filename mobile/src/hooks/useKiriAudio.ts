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

  // 🛠️ MODIFICACIÓN: Ahora la función acepta opcionalmente la palabra a reproducir
// Función dedicada a descargar y sonar el .mp3
  const reproducirPronunciacion = async (textoParaReproducir?: string) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      // Obtenemos la URL base original (que ya incluye el "?t=xxxx" de la cámara)
      const baseUrl = KiriService.getAudioUrl();
      
      // 🛠️ CORRECCIÓN AQUÍ: Separamos usando "&" en lugar de "?" porque la URL ya trae un parámetro previo
      const audioUrl = textoParaReproducir 
        ? `${baseUrl}&text=${encodeURIComponent(textoParaReproducir)}`
        : baseUrl;

      console.log("Descargando audio dinámico corregido desde:", audioUrl);

      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true }
      );

      soundRef.current = sound;
    } catch (audioError) {
      console.error("Error al reproducir el audio:", audioError);
    }
  };

  return { reproducirPronunciacion };
}