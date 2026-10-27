import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { api, NudgeProfile, UserMetrics } from './src/services/api';
import { requestNotificationPermissions, scheduleBehavioralNudge } from './src/utils/notifications';

// 🚨 PASTE YOUR REAL SUPABASE USER ID FROM SEED.PY HERE
const TARGET_USER_ID = "1f9567cd-c5d3-43d9-9ced-0c7248a92f8d";

export default function App() {
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [nudge, setNudge] = useState<NudgeProfile | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Load User Metrics on mount and ask for permissions
  useEffect(() => {
    async function initializeApp() {
      const granted = await requestNotificationPermissions();
      setPermissionGranted(granted);
      await fetchUserMetrics();
    }
    initializeApp();
  }, []);

  const fetchUserMetrics = async () => {
    if (TARGET_USER_ID.includes("TU_USER_ID")) return;
    setLoadingMetrics(true);
    try {
      const response = await api.get(`/api/v1/users/${TARGET_USER_ID}/metrics`);
      setMetrics(response.data);
    } catch (error) {
      console.error("Error loading metrics:", error);
    } finally {
      setLoadingMetrics(false);
    }
  };

  const fetchDynamicDiagnosis = async () => {
    if (TARGET_USER_ID.includes("TU_USER_ID")) {
      Alert.alert("Configuration Missing", "Please paste your real Supabase User ID from seed.py inside App.tsx");
      return;
    }

    setLoadingAnalytics(true);
    try {
      // 1. Fetch temporal patterns from FastAPI + Pandas
      const response = await api.get(`/api/v1/analytics/predict/${TARGET_USER_ID}`);
      const profile: NudgeProfile = response.data.nudge_profile;
      setNudge(profile);

      // 2. Automate local push hardware calendar allocation
      if (permissionGranted) {
        await scheduleBehavioralNudge(
          profile.critical_day,
          profile.nudge_trigger_time.hour,
          profile.nudge_trigger_time.minute,
          profile.suggested_nudge_message
        );
        Alert.alert("Nudge Live! 🎯", "Behavioral alert armed natively.");
      }
      
      // Refresh global metrics to track real-time dashboard state changes
      await fetchUserMetrics();
    } catch (error) {
      console.error(error);
      Alert.alert("Network Failure", "Could not synchronize analytical updates.");
    } finally {
      setLoadingAnalytics(false);
    }
  };

  if (loadingMetrics) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Synchronizing secure FinTech ledger...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {metrics?.first_name || 'User'}! 👤</Text>
          <Text style={styles.subtitle}>Real-time behavioral dashboard.</Text>
        </View>

        {/* 📊 REAL-TIME FINANCIAL METRICS WIDGET */}
        <View style={styles.widgetGrid}>
          <View style={styles.widgetCard}>
            <Text style={styles.widgetLabel}>Rescued Cash</Text>
            <Text style={styles.widgetValue}>${metrics?.rescued_cash_total.toFixed(2)}</Text>
            <Text style={styles.widgetSubtext}>From impulsive leaks</Text>
          </View>
          <View style={styles.widgetCard}>
            <Text style={styles.widgetLabel}>Goal Progress</Text>
            <Text style={styles.widgetValue}>
              {(((metrics?.saving_goal_current || 0) / (metrics?.saving_goal_target || 1)) * 100).toFixed(0)}%
            </Text>
            <Text style={styles.widgetSubtext}>{metrics?.saving_goal_name}</Text>
          </View>
        </View>

        {/* Predictive Data Section */}
        {loadingAnalytics ? (
          <View style={styles.innerLoading}>
            <ActivityIndicator size="small" color="#4F46E5" />
            <Text style={styles.analyticsLoadingText}>Mining temporal transactional arrays...</Text>
          </View>
        ) : nudge ? (
          <View style={styles.resultsContainer}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Supabase Data Vectors</Text>
              <Text style={styles.vectorData}>📅 Target Day: <Text style={styles.bold}>{nudge.critical_day}</Text></Text>
              <Text style={styles.vectorData}>🛍️ Impulsive Cluster: <Text style={styles.bold}>{nudge.critical_category}</Text></Text>
              <Text style={styles.vectorData}>⏰ Mean Vulnerable Hour: <Text style={styles.bold}>{nudge.average_critical_hour}:00 hrs</Text></Text>
            </View>

            <View style={[styles.card, styles.alertCard]}>
              <Text style={styles.alertTitle}>Hardware Scheduled Nudge 🔔</Text>
              <Text style={styles.alertTime}>Trigger Target: {nudge.nudge_trigger_time.hour}:{nudge.nudge_trigger_time.minute} hrs</Text>
              <Text style={styles.alertDescription}>"{nudge.suggested_nudge_message}"</Text>
              <Text style={styles.hardwareBadge}>🟢 Live inside iOS/Android Scheduler</Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Predictive Framework Idle</Text>
            <Text style={styles.emptySubtext}>Tap below to fire the Pandas data intelligence process across your cloud records.</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={fetchDynamicDiagnosis} disabled={loadingAnalytics}>
        <Text style={styles.buttonText}>{nudge ? 'Refresh Cloud Analysis' : 'Run Machine Learning Analysis'}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' },
  header: { marginTop: 40, marginBottom: 24 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 15, color: '#4B5563', marginTop: 4 },
  loadingText: { marginTop: 16, color: '#4F46E5', fontWeight: '600' },
  widgetGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  widgetCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, width: '48%', elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4 },
  widgetLabel: { fontSize: 12, color: '#6B7280', fontWeight: '600', textTransform: 'uppercase' },
  widgetValue: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginVertical: 4 },
  widgetSubtext: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
  innerLoading: { padding: 40, alignItems: 'center' },
  analyticsLoadingText: { marginTop: 10, color: '#4F46E5', fontWeight: '500', fontSize: 14 },
  resultsContainer: { marginTop: 4 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 20, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4 },
  cardTitle: { fontSize: 11, color: '#9CA3AF', fontWeight: '700', textTransform: 'uppercase', marginBottom: 12 },
  vectorData: { fontSize: 16, color: '#374151', marginVertical: 4 },
  bold: { fontWeight: 'bold', color: '#111827' },
  alertCard: { backgroundColor: '#EEF2F6', borderLeftWidth: 5, borderLeftColor: '#4F46E5' },
  alertTitle: { fontSize: 11, color: '#4F46E5', fontWeight: '700', textTransform: 'uppercase' },
  alertTime: { fontSize: 15, fontWeight: '600', color: '#1F2937', marginTop: 6 },
  alertDescription: { fontSize: 14, color: '#4B5563', lineHeight: 22, marginTop: 8, fontStyle: 'italic' },
  hardwareBadge: { fontSize: 11, color: '#059669', fontWeight: '700', marginTop: 12, textTransform: 'uppercase' },
  emptyState: { paddingVertical: 60, alignItems: 'center', paddingHorizontal: 20 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#374151' },
  emptySubtext: { fontSize: 13, color: '#6B7280', textAlign: 'center', marginTop: 6, lineHeight: 18 },
  button: { backgroundColor: '#4F46E5', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginBottom: 20, marginTop: 10 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
