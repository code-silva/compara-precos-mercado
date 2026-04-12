// 1. Importação do TouchableOpacity para permitir o clique e de outras bibliotecas necessárias

import {useState, useEffect} from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'; 
import { fetchMercados } from '../api/mercados';
import { Mercado } from '../types/mercado';
import { CarrosselProps } from '../types/mercado';

// 2. Constantes de cálculo 
const CARD_MIN_WIDTH = 160;
const MIN_CARDS_VISIBLE = 1;
const NEXT_CARD_PEEK = 0.2;
const CARD_MARGIN_OFFSET = 16;

const { width, height } = Dimensions.get('window');
const cardsQueCabem = Math.floor(width / CARD_MIN_WIDTH);
const quantity = Math.max(MIN_CARDS_VISIBLE, cardsQueCabem);
const divisor = quantity + NEXT_CARD_PEEK;
const cardWidth = (width / divisor) - CARD_MARGIN_OFFSET;

// 3. Adicionado o onPressMercado à desestruturação das props
export const CarrosselMercados = ({ coords, onPressMercado }: CarrosselProps & { onPressMercado: (mercado: Mercado) => void }) => {

  const [supermarkets, setSupermarkets] = useState<Mercado[]>([]);

  useEffect(() => {
    async function loadSupermarkets() {
      if (!coords) return;
      let data = await fetchMercados(coords.latitude, coords.longitude);
      setSupermarkets(data.results);
    };
    loadSupermarkets();
  }, [coords]);


  // 4. Transformação da View do card em um TouchableOpacity e chamada da trigger no onPress

  const renderItem = ({item}: {item: Mercado}) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPressMercado(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.name}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mercados Próximos</Text>
      <FlatList
        data={supermarkets}
        keyExtractor= {(item) => item.id.toString()}
        renderItem={renderItem}
        horizontal
        ItemSeparatorComponent={() => <View style={{ width: CARD_MARGIN_OFFSET }}/>}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: 8,
        }}
      />
    </View>
  );
};


// 5. Estilos para o carrossel e os cards dos Mercados Horizontais

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    minHeight: 150,
  },

  title: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#333333',

    marginBottom: 8,
  },

  card: {
    backgroundColor: '#FFFFFF',
    width: cardWidth,
    height: height * 0.15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    boxShadow: '0 2px 4px rgba(99, 12, 12, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  name: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    color: '#333333',
    marginBottom: 4,
    textAlign: 'center',
  },

});