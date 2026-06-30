import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IP de la máquina donde corre el backend (puerto del .env.development)
const BASE_URL = 'http://192.168.1.114:8020/api/mobile';

const api = axios.create({ baseURL: BASE_URL, timeout: 10000 });

// Adjunta el JWT en cada petición protegida
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
