import axios from 'axios';

const baseURL = process.env.EXPO_PUBLIC_API_URL;
const HOST = baseURL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: HOST, 
  timeout: 15000, 
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const KiriService = {
 
  predictObject: async (imageUri: string) => {
    const formData = new FormData();
    const filename = imageUri.split('/').pop() || 'photo.jpg';
    
    formData.append('file', {
      uri: imageUri,
      name: filename,
      type: 'image/jpeg',
    } as any);

    try {
      const response = await apiClient.post('/predict', formData);
      return response.data; 
    } catch (error) {
      console.error('Error en la petición de Kiri AI:', error);
      throw error;
    }
  },

  
  getAudioUrl: () => {
    return `${HOST}/get-audio?t=${Date.now()}`;
  }
};