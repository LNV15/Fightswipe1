import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const API_BASE = "http://localhost:8000"; // später durch Produktions-URL ersetzen

export default function App() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE}/health`)
      .then((res) => setHealth(res.data))
      .catch(() => setHealth({ error: true }));
  }, []);

  if (!health) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E53935" />
        <Text style={{ marginTop: 10 }}>Verbinde mit Fightswipe-Server...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/558/558609.png" }} style={{ width: 64, height: 64 }} />
        <Text style={styles.title}>Fightswipe</Text>
      </View>
      <View style={styles.card}>
        {health.error ? (
          <Text style={styles.error}>⚠️ Verbindung fehlgeschlagen</Text>
        ) : (
          <>
            <Text style={styles.ok}>✅ Server läuft</Text>
            <Text style={{ color: "#777" }}>Ping: {health.time}</Text>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Zum Login-Screen (kommt als Nächstes)</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", alignItems: "center", justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 20 },
  title: { color: "#fff", fontSize: 32, fontWeight: "bold", marginTop: 10 },
  card: { backgroundColor: "#111", padding: 20, borderRadius: 12, marginBottom: 20 },
  ok: { color: "#4CAF50", fontSize: 18 },
  error: { color: "#E53935", fontSize: 18 },
  button: { backgroundColor: "#E53935", padding: 14, borderRadius: 10 },
  buttonText: { color: "#fff", fontWeight: "600" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" }
});
