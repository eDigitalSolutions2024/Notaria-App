import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Platform, Alert, ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const COLORS = {
  chocolate: '#3A241D',
  marfil:    '#F5F0E8',
  taupe:     '#8B7765',
  piedra:    '#C9C2B8',
  oro:       '#D4AF37',
};

export default function CrearPasswordScreen() {
  const { crearPassword } = useAuth();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleActivar() {
    if (!correo.trim() || !password || !confirmar) {
      Alert.alert('Campos requeridos', 'Completa todos los campos.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Contraseña muy corta', 'Debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmar) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    try {
      await crearPassword(correo.trim().toLowerCase(), password);
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'Error al activar cuenta.';
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
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Activar Cuenta</Text>
        <Text style={styles.info}>
          Usa el correo que registraste en la notaría para crear tu contraseña.
        </Text>

        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="tu@correo.com"
          placeholderTextColor={COLORS.taupe}
          keyboardType="email-address"
          autoCapitalize="none"
          value={correo}
          onChangeText={setCorreo}
        />

        <Text style={styles.label}>Nueva contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Mínimo 6 caracteres"
          placeholderTextColor={COLORS.taupe}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Confirmar contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Repite tu contraseña"
          placeholderTextColor={COLORS.taupe}
          secureTextEntry
          value={confirmar}
          onChangeText={setConfirmar}
        />

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleActivar}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={COLORS.chocolate} />
            : <Text style={styles.btnText}>Activar Cuenta</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: COLORS.chocolate },
  scroll: { padding: 24, paddingTop: 90 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.marfil,
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: COLORS.piedra,
    marginBottom: 28,
    lineHeight: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.oro,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.taupe,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 15,
    backgroundColor: COLORS.marfil,
    color: COLORS.chocolate,
  },
  btn: {
    backgroundColor: COLORS.oro,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: COLORS.chocolate, fontWeight: 'bold', fontSize: 16, letterSpacing: 0.5 },
});
