import React from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';

const CARD_MIN_WIDTH = 160;     // A largura mínima de um card na tela
const MIN_CARDS_VISIBLE = 1;    // A quantidade mínima de cards inteiros visíveis na tela
const NEXT_CARD_PEEK = 0.2;     // Fração do próximo card que fica à mostra (0.2 = 20%)
const CARD_MARGIN_OFFSET = 16;  // É a margem entre um card e outro

const { width, height } = Dimensions.get('window');
const cardsQueCabem = Math.floor(width / CARD_MIN_WIDTH);
const quantidade = Math.max(MIN_CARDS_VISIBLE, cardsQueCabem);
const divisor = quantidade + NEXT_CARD_PEEK;
const cardWidth = (width / divisor) - CARD_MARGIN_OFFSET;

const MERCADOS_MOCK = [
  { id: 1, nome: 'Comper', cor_texto: '#0D69AB' },
  { id: 2, nome: 'Dia a Dia', cor_texto: '#A6CE39' },
  { id: 3, nome: 'Atacadão', cor_texto: '#F67300' },
];

export const CarrosselMercados = () => {

  // Função para renderizar os cards na tela
  const renderItem = ({item}) => (

    <View style={styles.card}>
      <Text style={[styles.nome, {color: item.cor_texto}]}>
        {item.nome}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mercados Próximos</Text>
      <FlatList
        data={MERCADOS_MOCK}
        keyExtractor= {(item) => item.id.toString()}
        renderItem={renderItem}
        horizontal
        ItemSeparatorComponent={() => <View style={{ width: CARD_MARGIN_OFFSET }}/>}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },

  titulo: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: '#333333',
    marginLeft: 16,
    marginBottom: 8,
  },

  card: {
    backgroundColor: '#FFFFFF',
    width: cardWidth,
    height: height * 0.15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  nome: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#333333',
    marginBottom: 4,
    alignContent: 'center',
  },

});