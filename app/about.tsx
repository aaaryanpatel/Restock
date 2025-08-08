// app/about.tsx
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      {/* Use your logo if you want */}
      <Image source={require("../assets/restock-logo.png")} style={styles.logo} />
      <Text style={styles.title}>Restock</Text>
      <Text style={styles.version}>Version 1.0.0</Text>
      <Text style={styles.desc}>The simplest way to scan, track, and restock at work.</Text>
      <Text style={styles.company}>© 2024 Aryan Patel</Text>
      {/* Add more info as needed */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  logo: { width: 90, height: 90, marginBottom: 16, resizeMode: "contain" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 2 },
  version: { fontSize: 16, color: "#555", marginBottom: 8 },
  desc: { fontSize: 15, color: "#444", marginBottom: 12, textAlign: "center", paddingHorizontal: 30 },
  company: { fontSize: 13, color: "#aaa" },
});
