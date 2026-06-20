import apiClient from './apiClient';

export const getHistory = (page = 1, limit = 5, module = '') => {
  let url = `/history?page=${page}&limit=${limit}`;
  if (module) {
    url += `&module=${encodeURIComponent(module)}`;
  }
  return apiClient.get(url);
};

export const getStats = () => 
  apiClient.get('/history/stats');

export const deleteHistory = (ids = [], all = false) => 
  apiClient.delete('/history', { data: { ids, all } });
