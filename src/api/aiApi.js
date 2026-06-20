import apiClient from './apiClient';

export const translateText = (data) => apiClient.post('/ai/translate', data);
export const generateEmail = (data) => apiClient.post('/ai/generate-email', data);
export const analyzeEntities = (data) => apiClient.post('/ai/analyze-entities', data);
export const generateSpeech = (text, lang) => apiClient.post('/ai/speak', { text, lang }, { responseType: 'blob' });
