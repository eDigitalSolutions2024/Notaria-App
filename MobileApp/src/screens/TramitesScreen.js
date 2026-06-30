import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const COLORS = {
  chocolate: '#3A241D',
  marfil:    '#F5F0E8',
  taupe:     '#8B7765',
  piedra:    '#C9C2B8',
  oro:       '#D4AF37',
};

const STATUS_CONFIG = {
  'Tomado': {
    label: 'Armándose',
    color: '#C8860A',
    anim:  require('../assets/animations/armandose.json'),
    animW: 52,
    animH: 26,
  },
  'Pendiente': {
    label: 'Armándose',
    color: '#C8860A',
    anim:  require('../assets/animations/armandose.json'),
    animW: 52,
    animH: 26,
  },
  'Firma Notario': {
    label: 'En Firma',
    color: '#1a6fa8',
    anim:  require('../assets/animations/firma.json'),
    animW: 32,
    animH: 32,
  },
  'Recibido': {
    label: 'En Recepción',
    color: '#1a7a46',
    anim:  require('../assets/animations/recepcion.json'),
    animW: 32,
    animH: 32,
  },
  'Entregado': {
    label: 'Entregado',
    color: '#4527a0',
    anim:  null,
    animW: 0,
    animH: 0,
  },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Tomado'];
  return (
    <View style={[styles.statusBadge, { borderColor: cfg.color }]}>
      <Text style={[styles.statusLabel, { color: cfg.color }]}>{cfg.label}</Text>
      {cfg.anim && (
        <LottieView
          source={cfg.anim}
          autoPlay
          loop
          style={{ width: cfg.animW, height: cfg.animH }}
        />
      )}
      {!cfg.anim && (
        <Text style={{ fontSize: 14, marginLeft: 4 }}>✓</Text>
      )}
    </View>
  );
}

export default function TramitesScreen({ navigation }) {
  const { cliente, logout } = useAuth();
  const [tramites, setTramites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTramites = useCallback(async () => {
    try {
      const { data } = await api.get('/tramites');
      setTramites(data);
    } catch (err) {
      Alert.alert('Error', 'No se pudieron cargar los trámites.');
    }
  }, []);

  useEffect(() => {
    fetchTramites().finally(() => setLoading(false));
  }, [fetchTramites]);

  async function onRefresh() {
    setRefreshing(true);
    await fetchTramites();
    setRefreshing(false);
  }

  function handleLogout() {
    Alert.alert('Cerrar sesión', '¿Seguro que deseas salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: logout },
    ]);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.oro} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, {cliente?.nombre?.split(' ')[0]}</Text>
          <Text style={styles.subgreeting}>{cliente?.correo}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>
        {tramites.length === 0 ? 'Sin trámites' : `${tramites.length} trámite(s)`}
      </Text>

      <FlatList
        data={tramites}
        keyExtractor={(item) => String(item._id)}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.oro]}
            tintColor={COLORS.oro}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              No tienes trámites registrados aún.{'\n'}
              Consulta con la notaría.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('DetalleTramite', { tramite: item })}
            activeOpacity={0.75}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardNum}>Trámite #{item.numeroTramite}</Text>
              <StatusBadge status={item.estatus_entrega} />
            </View>
            <Text style={styles.cardTipo}>{item.tipoTramite}</Text>
            <Text style={styles.cardMeta}>
              {item.fecha ? new Date(item.fecha).toLocaleDateString('es-MX') : '—'}
              {'  ·  '}
              {item.abogado}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.marfil },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.marfil },
  header: {
    backgroundColor: COLORS.chocolate,
    padding: 20,
    paddingTop: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: { color: COLORS.marfil, fontSize: 18, fontWeight: 'bold' },
  subgreeting: { color: COLORS.piedra, fontSize: 12, marginTop: 2 },
  logoutBtn: {
    borderWidth: 1,
    borderColor: COLORS.oro,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  logoutText: { color: COLORS.oro, fontSize: 13 },
  sectionTitle: {
    padding: 16,
    paddingBottom: 8,
    fontSize: 12,
    color: COLORS.taupe,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.oro,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  cardNum: { fontSize: 15, fontWeight: 'bold', color: COLORS.chocolate },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#fff',
    gap: 2,
  },
  statusLabel: { fontSize: 12, fontWeight: '700' },
  cardTipo: { fontSize: 14, color: COLORS.chocolate, marginTop: 6 },
  cardMeta: { fontSize: 12, color: COLORS.taupe, marginTop: 4 },
  empty: { alignItems: 'center', marginTop: 60, paddingHorizontal: 40 },
  emptyText: { color: COLORS.taupe, textAlign: 'center', lineHeight: 22 },
});
