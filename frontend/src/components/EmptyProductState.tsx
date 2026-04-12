import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const EmptyProductState = () => (
  <View style={styles.container}>
    {/* Um emoji ou ícone de busca/caixa vazia ajuda na UX */}
    <Text style={styles.icone}>🔍</Text>
    <Text style={styles.titulo}>Nenhum produto encontrado</Text>
    <Text style={styles.subtitulo}>
      Não encontrámos ofertas nesta localização. Tente mudar a sua posição ou atualizar a lista.
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    //paddingTop: 50, // Dá um destaque para não ficar colado no topo
    // paddingHorizontal: 40,
  },
  icone: {
    fontSize: 30,
    marginBottom: 15,
  },
  titulo: {
    fontSize: 18,
    fontFamily: 'Inter-Bold', // Se já configurou as fontes
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    //lineHeight: 20,
  },
});