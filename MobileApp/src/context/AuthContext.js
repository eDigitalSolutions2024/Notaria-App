import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al arrancar la app, restaurar sesión guardada
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const raw = await AsyncStorage.getItem('cliente');
        if (token && raw) setCliente(JSON.parse(raw));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function login(correo, password) {
    const { data } = await api.post('/auth/login', { correo, password });
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('cliente', JSON.stringify(data.cliente));
    setCliente(data.cliente);
  }

  async function crearPassword(correo, password) {
    const { data } = await api.post('/auth/crear-password', { correo, password });
    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('cliente', JSON.stringify(data.cliente));
    setCliente(data.cliente);
  }

  async function logout() {
    await AsyncStorage.multiRemove(['token', 'cliente']);
    setCliente(null);
  }

  return (
    <AuthContext.Provider value={{ cliente, loading, login, crearPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
