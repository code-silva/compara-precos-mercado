import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

interface LoadingFooterProps {
  isLoading: boolean;
  message?: string;
}

export const LoadingFooter: React.FC<LoadingFooterProps> = ({
  isLoading,
  message = "Carregando mais ofertas...",
}) => {
  if (!isLoading) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#28a8b5" />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    alignItems: "center",
    width: "100%",
  },
  text: {
    marginTop: 10,
    color: "#28a8b5",
    fontSize: 14,
    fontFamily: "Inter-Medium",
  },
});
