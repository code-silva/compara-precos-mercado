import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const EmptyProductState = () => (
  <View style={styles.container}>
    <Text style={styles.icon}>🔍</Text>
    <Text style={styles.title}>Nenhum produto encontrado</Text>
    <Text style={styles.subtitle}>
      Não encontrámos ofertas nesta localização. Tente mudar a sua posição ou
      atualizar a lista.
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  icon: {
    fontSize: 30,
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
});
