import axios from 'axios';
// @ts-ignore
const baseURL = process.env.EXPO_PUBLIC_API_URL
// Crear una instancia centralizada de Axios
const apiClient = axios.create({
  baseURL: baseURL || 'o', // Respaldo por si acaso
  timeout: 10000, // 10 segundos de espera máxima
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const KiriService = {
  /**
   * Envía la imagen capturada al servidor de Flask para su análisis
   * @param imageUri Ruta local de la imagen en el iPhone
   */
  predictObject: async (imageUri: string) => {
    const formData = new FormData();
    
    // Preparar el archivo en el formato que los celulares requieren para subir archivos
    const filename = imageUri.split('/').pop() || 'photo.jpg';
    
    // Estructura nativa requerida por FormData en React Native
    formData.append('file', {
      uri: imageUri,
      name: filename,
      type: 'image/jpeg',
    } as any);

    try {
      const response = await apiClient.post('/predict', formData);
      return response.data; // Aquí vendrá el { "object": "Peach" }
    } catch (error) {
      console.error('Error en la petición de Kiri AI:', error);
      throw error;
    }
  },
};