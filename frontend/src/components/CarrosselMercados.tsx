import {useState, useEffect} from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import { fetchMercados } from '../api/mercados';
import { Mercado } from '../types/mercado';
import { CarrosselProps } from '../types/mercado';

const CARD_MIN_WIDTH = 160;     // A card's minium width
const MIN_CARDS_VISIBLE = 1;    // The minium number of cards visible on the screen
const NEXT_CARD_PEEK = 0.2;     // Fraction of the next card visible (0.2 = 20%)
const CARD_MARGIN_OFFSET = 16;  // The margin between 2 cards

const { width, height } = Dimensions.get('window');
const cardsQueCabem = Math.floor(width / CARD_MIN_WIDTH);
const quantity = Math.max(MIN_CARDS_VISIBLE, cardsQueCabem);
const divisor = quantity + NEXT_CARD_PEEK;
const cardWidth = (width / divisor) - CARD_MARGIN_OFFSET;


export const CarrosselMercados = ({ coords }: CarrosselProps) => {

  const [supermarkets, setSupermarkets] = useState<Mercado[]>([]);

  useEffect(() => {
    async function loadSupermarkets() {
      if (!coords) return;

      let data = await fetchMercados(coords.latitude, coords.longitude);
      setSupermarkets(data.results);
    };

    loadSupermarkets();
  }, [coords]);


  // Function to render items on the FlatList
  const renderItem = ({item}) => (
    <View style={styles.card}>
      <Text style={styles.name}>
        {item.name}
      </Text>
    </View>
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
    minHeight: 150,
  },

  title: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
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

  name: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    color: '#333333',
    marginBottom: 4,
    textAlign: 'center',
  },

});