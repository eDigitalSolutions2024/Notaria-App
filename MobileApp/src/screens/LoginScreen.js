import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Platform, Alert, Image,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const COLORS = {
  chocolate: '#3A241D',
  marfil:    '#F5F0E8',
  taupe:     '#8B7765',
  piedra:    '#C9C2B8',
  oro:       '#D4AF37',
};

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!correo.trim() || !password) {
      Alert.alert('Campos requeridos', 'Ingresa tu correo y contraseña.');
      return;
    }
    setLoading(true);
    try {
      await login(correo.trim().toLowerCase(), password);
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'Error al iniciar sesión.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>Portal de Clientes</Text>
        <Text style={styles.tagline}>Su Éxito es el Nuestro</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor={COLORS.taupe}
          keyboardType="email-address"
          autoCapitalize="none"
          value={correo}
          onChangeText={setCorreo}
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor={COLORS.taupe}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.btnText}>Iniciar Sesión</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate('CrearPassword')}
        >
          <Text style={styles.linkText}>¿Primera vez? Activa tu cuenta</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.chocolate,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: COLORS.marfil,
    borderRadius: 16,
    padding: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  logo: {
    width: '100%',
    height: 110,
    marginBottom: 8,
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.taupe,
    textAlign: 'center',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.oro,
    textAlign: 'center',
    fontStyle: 'italic',
    letterSpacing: 0.5,
    marginBottom: 28,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.piedra,
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    fontSize: 15,
    color: COLORS.chocolate,
    backgroundColor: '#fff',
  },
  btn: {
    backgroundColor: COLORS.oro,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: COLORS.chocolate, fontWeight: 'bold', fontSize: 16, letterSpacing: 0.5 },
  link: { marginTop: 18, alignItems: 'center' },
  linkText: { color: COLORS.taupe, fontSize: 14, textDecorationLine: 'underline' },
});
