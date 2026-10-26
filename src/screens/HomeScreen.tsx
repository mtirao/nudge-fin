import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';

// Simulación de tipado de datos para tu portafolio
interface UserProgress {
  savingGoal: string;
  targetAmount: number;
  currentSaved: number;
  rescuedCash: number; // Dinero salvado gracias a las alertas
}

export default function HomeScreen() {
  const [data, setData] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí conectarás con tu Backend en FastAPI/Node.js más adelante
    setTimeout(() => {
      setData({
        savingGoal: "Viaje a Japón 🇯🇵",
        targetAmount: 3000,
        currentSaved: 1200,
        rescuedCash: 150, // Lo que ha ahorrado al evitar gastos impulsivos
      });
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>¡Hola de nuevo!</Text>
        <Text style={styles.subtitle}>Tu comportamiento financiero está mejorando.</Text>
      </View>

      {/* Tarjeta de Meta Principal */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tu Meta Actual</Text>
        <Text style={styles.goalName}>{data?.savingGoal}</Text>
        <Text style={styles.goalProgress}>
          ${data?.currentSaved} de ${data?.targetAmount} USD
        </Text>
      </View>

      {/* Tarjeta del Impacto Psicológico (Propuesta de valor de NudgeFin) */}
      <View style={[styles.card, styles.alertCard]}>
        <Text style={styles.alertTitle}>Efecto NudgeFin 🧠</Text>
        <Text style={styles.alertValue}>${data?.rescuedCash} USD</Text>
        <Text style={styles.alertDescription}>
          Dinero que rescataste de compras impulsivas este mes gracias a las alertas preventivas.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => alert('Simulación: Analizando nuevos patrones...')}>
        <Text style={styles.buttonText}>Actualizar Diagnóstico</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { marginTop: 20, marginBottom: 30 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 5 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: { fontSize: 14, color: '#9CA3AF', fontWeight: '600', uppercase: true },
  goalName: { fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginTop: 8 },
  goalProgress: { fontSize: 16, color: '#4B5563', marginTop: 4 },
  alertCard: { backgroundColor: '#EEF2F6', borderLeftWidth: 5, borderLeftColor: '#6366F1' },
  alertTitle: { fontSize: 14, color: '#4F46E5', fontWeight: '700' },
  alertValue: { fontSize: 32, fontWeight: 'bold', color: '#111827', marginVertical: 6 },
  alertDescription: { fontSize: 14, color: '#4B5563', lineHeight: 20 },
  button: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
