import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface LoadingFooterProps {
  isLoading: boolean;
  mensagem?: string;
}

export const LoadingFooter: React.FC<LoadingFooterProps> = ({ 
  isLoading, 
  mensagem = "Carregando mais ofertas..." 
}) => {
  if (!isLoading) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#28a8b5" />
      <Text style={styles.texto}>{mensagem}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    alignItems: 'center',
    width: '100%', // Importante para FlatList em grade
  },
  texto: {
    marginTop: 10,
    color: '#28a8b5',
    fontSize: 14,
    fontFamily: 'Inter-Medium', // Usando a fonte que você já carregou
  },
});