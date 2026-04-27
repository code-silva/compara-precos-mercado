import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface ErrorStateProps {
  message: string;
  handleRetry: () => void;
}

export const ErrorState = ({ message, handleRetry }: ErrorStateProps) => (
  <View style={styles.container}>
    <Text style={styles.icon}>📍</Text>
    <Text style={styles.text}>{message}</Text>

    <TouchableOpacity style={styles.button} onPress={handleRetry}>
      <Text style={styles.buttonText}>Tentar Novamente</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  icon: {
    fontSize: 40,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Inter-Regular",
  },
  button: {
    backgroundColor: "#28a8b5",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    elevation: 3,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
