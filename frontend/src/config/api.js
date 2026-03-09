export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
console.log('ADSUM API URL:', API_BASE_URL);
console.log('Is Production?', import.meta.env.PROD);

export const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};
