import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost/smart/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('auth_token');

  // Temporary: Use your specific token for testing
  const testToken = 'rHJnHSkn8wPU46Exxrr5MZXhnq80KFjlYTvNscx96b8f6ff0';

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Using stored token:', token);
    console.log('Token length:', token.length);
  } else {
    // Fallback to test token
    config.headers.Authorization = `Bearer ${testToken}`;
    console.log('Using test token:', testToken);
  }

  // Debug logging
  console.log('API Request:', config.method?.toUpperCase(), config.url);
  console.log('Full URL:', config.baseURL + config.url);
  console.log('Headers:', config.headers);

  return config;
});

// Handle token expiration
api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  async error => {
    console.error(
      'API Error:',
      error.response?.status,
      error.response?.data,
      error.config?.url,
    );
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('auth_token');
      // Navigate to login screen
    }
    return Promise.reject(error);
  },
);

export default api;
