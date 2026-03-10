import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TelaErroProps {
  mensagem: string;
  aoTentarNovamente: () => void;
}

export const TelaErro = ({ mensagem, aoTentarNovamente }: TelaErroProps) => (
  <View style={styles.container}>
    {/* Adicionei um emoji fixo para ficar mais visual */}
    <Text style={styles.icone}>📍</Text> 
    <Text style={styles.texto}>{mensagem}</Text>
    
    <TouchableOpacity 
      style={styles.botao} 
      onPress={aoTentarNovamente}
    >
      <Text style={styles.textoBotao}>Tentar Novamente</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F9FA', // Fundo padrão
  },
  icone: {
    fontSize: 40,
    marginBottom: 10,
  },
  texto: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Inter-Regular', // Se estiver usando
  },
  botao: {
    backgroundColor: '#28a8b5',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    elevation: 3,
  },
  textoBotao: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});