import {useState, useEffect} from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import { fetchMercados } from '../api/mercados';
import { Mercado } from '../types/mercado';

const CARD_MIN_WIDTH = 160;     // A largura mínima de um card na tela
const MIN_CARDS_VISIBLE = 1;    // A quantidade mínima de cards inteiros visíveis na tela
const NEXT_CARD_PEEK = 0.2;     // Fração do próximo card que fica à mostra (0.2 = 20%)
const CARD_MARGIN_OFFSET = 16;  // É a margem entre um card e outro

const { width, height } = Dimensions.get('window');
const cardsQueCabem = Math.floor(width / CARD_MIN_WIDTH);
const quantidade = Math.max(MIN_CARDS_VISIBLE, cardsQueCabem);
const divisor = quantidade + NEXT_CARD_PEEK;
const cardWidth = (width / divisor) - CARD_MARGIN_OFFSET;

const gerarCorAleatoria = () => {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 65 + Math.random() * 20;
  const lightness = 40 + Math.random() * 15;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

interface CarrosselProps {
  coords?: {
    latitude: number;
    longitude: number;
  } | null;
}

export const CarrosselMercados = ({ coords }: CarrosselProps) => {

  const [mercados, setMercados] = useState<Mercado[]>([]);

  useEffect(() => {
    const carregarDados = async () => {
      // Se a HomeScreen ainda não pegou o GPS, não fazemos a chamada
      if (!coords) return;

      try {
        // Agora usamos latitude e longitude que vieram via props!
        let dados = await fetchMercados(coords.latitude, coords.longitude);

        // Adicionando uma cor para o texto (sua lógica original)
        const dadosComCores = dados.map((mercado: Mercado) => ({
          ...mercado,
          cor_nome: gerarCorAleatoria(),
        }));

        setMercados(dadosComCores);
      } catch (error) {
        console.error("Erro ao buscar mercados:", error);
      }
    };

    carregarDados();
  }, [coords]);


  // Função para renderizar os cards na tela
  const renderItem = ({item}) => (

    <View style={styles.card}>
      <Text style={[styles.nome, {color: item.cor_nome}]}>
        {item.nome}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mercados Próximos</Text>
      <FlatList
        data={mercados}
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
    paddingVertical: 10,// ADICIONE ISSO
    minHeight: 150,           // ADICIONE ISSO
  },

  titulo: {
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

  nome: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    color: '#333333',
    marginBottom: 4,
    textAlign: 'center',
  },

});