import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ESTATUS_CONFIG = {
  'Tomado':        { label: 'Armándose',    color: '#C8860A' },
  'Pendiente':     { label: 'Armándose',    color: '#C8860A' },
  'Firma Notario': { label: 'En Firma',     color: '#1a6fa8' },
  'Recibido':      { label: 'En Recepción', color: '#1a7a46' },
  'Entregado':     { label: 'Entregado',    color: '#4527a0' },
};

function Row({ label, value }) {
  if (!value) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function DetalleTramiteScreen({ route }) {
  const { tramite } = route.params;

  const fechaStr = tramite.fecha
    ? new Date(tramite.fecha).toLocaleDateString('es-MX', {
        day: '2-digit', month: 'long', year: 'numeric',
      })
    : '—';

  const fechaEntregaStr = tramite.fecha_entrega
    ? new Date(tramite.fecha_entrega).toLocaleDateString('es-MX', {
        day: '2-digit', month: 'long', year: 'numeric',
      })
    : null;

  const estatusCfg = ESTATUS_CONFIG[tramite.estatus_entrega] || ESTATUS_CONFIG['Tomado'];
  const color = estatusCfg.color;
  const estatusLabel = estatusCfg.label;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Cabecera */}
      <View style={styles.headerCard}>
        <Text style={styles.tramiteNum}>Trámite #{tramite.numeroTramite}</Text>
        <View style={[styles.badge, { backgroundColor: color }]}>
          <Text style={styles.badgeText}>{estatusLabel}</Text>
        </View>
        <Text style={styles.tipo}>{tramite.tipoTramite}</Text>
      </View>

      {/* Datos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información General</Text>
        <Row label="Cliente" value={tramite.cliente} />
        <Row label="Abogado" value={tramite.abogado} />
        <Row label="Fecha" value={fechaStr} />
        {fechaEntregaStr && <Row label="Fecha entrega" value={fechaEntregaStr} />}
        <Row label="Volumen" value={tramite.volumen ? String(tramite.volumen) : null} />
      </View>

      {/* Observaciones */}
      {tramite.observaciones ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observaciones</Text>
          <Text style={styles.obsText}>{tramite.observaciones}</Text>
        </View>
      ) : null}

      {/* Recibo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recibo</Text>
        <Row
          label="Estatus"
          value={
            tramite.estatus_recibo === 'CON_RECIBO' ? 'Con recibo' :
            tramite.estatus_recibo === 'JUSTIFICADO' ? 'Justificado' :
            'Sin recibo'
          }
        />
        {tramite.justificante_text
          ? <Row label="Justificante" value={tramite.justificante_text} />
          : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  content: { padding: 16, paddingBottom: 40 },
  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  tramiteNum: { fontSize: 20, fontWeight: 'bold', color: '#1a3a5c' },
  badge: { borderRadius: 14, paddingHorizontal: 14, paddingVertical: 4, marginVertical: 8 },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  tipo: { fontSize: 15, color: '#444', textAlign: 'center' },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a3a5c',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rowLabel: { fontSize: 13, color: '#888', flex: 1 },
  rowValue: { fontSize: 13, color: '#333', flex: 2, textAlign: 'right' },
  obsText: { fontSize: 14, color: '#444', lineHeight: 20 },
});
