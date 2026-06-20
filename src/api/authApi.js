import apiClient from './apiClient';

export const login = (data) => apiClient.post('/auth/login', data);
export const register = (data) => apiClient.post('/auth/register', data);
export const getMe = () => apiClient.get('/auth/me');
export const updateProfile = (data) => apiClient.put('/auth/profile', data);
export const changePassword = (data) => apiClient.post('/auth/change-password', data);
