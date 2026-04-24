import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, View, StyleSheet, Text } from 'react-native';
import { Produto } from '../types/product';
import * as Location from 'expo-location';
import { TelaErro } from '../components/TelaErro';
import { EmptyProductState } from '../components/EmptyProductState';
import { fetchProdutos } from '../api/produtos';
import { SearchBar } from '../components/SearchBar';
import { InfoBanner } from '../components/InfoBanner';
import { CarrosselMercados } from '../components/CarrosselMercados';
import { useNavigation } from '@react-navigation/native';
import { LoadingFooter } from '../components/LoadingFooter';
import CardProduto from '../components/ProductCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// FUNÇÕES DE APOIO
const separador = () => <View style={styles.divisor} />;

const CabecalhoLista = React.memo(({
  localizacao,
  aoPressionarMercado
}: {
  localizacao: any,
  aoPressionarMercado: (mercado: any) => void
}) => (
  <View style={[styles.containerCabecalho, { alignSelf: 'stretch' }]}>
    <SearchBar />
    <CarrosselMercados
      coords={localizacao?.coords}
      onPressMercado={aoPressionarMercado}
    />
    <InfoBanner/>
    <Text style={styles.tituloSecao}>Ofertas do Dia</Text>
  </View>
));

export function HomeScreen() {
  const insets = useSafeAreaInsets(); 
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [pagina, setPagina] = useState(1);
  const [carregando, setCarregando] = useState(false);
  const [temMaisDados, setTemMaisDados] = useState(true);
  const [localizacao, setLocalizacao] = useState<Location.LocationObject | null>(null);
  const [erroLocalizacao, setErroLocalizacao] = useState<string | null>(null);

  const navigation = useNavigation<any>();

  // AÇÃO AO CLICAR NO PRODUTO
  const handlePress = useCallback((produto: Produto) => {
    console.log('Abriu detalhes de:', produto.nome_produto);
  }, []);

  const handleAdd = useCallback((produto: Produto) => {
    console.log('Adicionou à lista:', produto.nome_produto);
  }, []);

  // NAVEGAÇÃO PARA A TELA DE MERCADO ESPECÍFICO
  const handleMercadoPress = useCallback((mercado: any) => {
  // Agora chamamos direto, pois a tela está no mesmo Stack da Home
  navigation.navigate('StoreProducts', { 
    mercadoSelecionado: {
      id: mercado.id,
      name: mercado.name
    },
    latitude: localizacao?.coords.latitude,
    longitude: localizacao?.coords.longitude
  });
}, [localizacao, navigation]);

  // OBTENÇÃO DA LOCALIZAÇÃO (Gama/Santa Maria)
  const obterLocalizacao = useCallback(async () => {
    setCarregando(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErroLocalizacao('Precisamos da localização para mostrar as ofertas próximas.');
        return;
      }
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocalizacao(location);
      setErroLocalizacao(null);
    } catch (error) {
      setErroLocalizacao('Não foi possível obter sua localização atual.');
    } finally {
      setCarregando(false);
    }
  }, []);

  // BUSCA DE PRODUTOS GERAIS (Sem filtro de mercado)
  const buscarProdutos = useCallback(async () => {
    if (carregando || !temMaisDados || !localizacao) return;

    setCarregando(true);
    try {
      const { latitude, longitude } = localizacao.coords;

      // Busca global baseada na localização, sem ID de mercado fixo
      const resposta = await fetchProdutos(latitude, longitude, pagina);

      const novosProdutos = resposta.results || [];
      const proximaPagina = resposta.next;

      if (novosProdutos.length > 0) {
        setProdutos(prev => [...prev, ...novosProdutos]);
        if (proximaPagina === null) {
          setTemMaisDados(false);
        } else {
          setPagina(prev => prev + 1);
        }
      } else {
        setTemMaisDados(false);
      }
    } catch (error) {
      console.log("Erro ao buscar produtos na Home:", error);
      setTemMaisDados(false);
    } finally {
      setCarregando(false);
    }
  }, [localizacao, temMaisDados, carregando, pagina]);

  const alternarLocalizacao = useCallback(() => {
    setProdutos([]);
    setPagina(1);
    setTemMaisDados(true);
    obterLocalizacao();
  }, [obterLocalizacao]);

  // EFEITOS
  useEffect(() => {
    obterLocalizacao();
  }, [obterLocalizacao]);

  useEffect(() => {
    if (localizacao && produtos.length === 0 && !carregando && temMaisDados) {
      buscarProdutos();
    }
  }, [localizacao, produtos.length, carregando, temMaisDados, buscarProdutos]);

  const renderizarItem = useCallback(({ item, index }: { item: Produto; index: number }) => (
    <CardProduto
      produto={{...item, ranking: index + 1}}
      aoPressionar={() => handlePress(item)}
      aoAdicionarNaLista={() => handleAdd(item)}
    />
  ), [handlePress, handleAdd]);

  const renderRodape = () => {
    if (carregando && produtos.length === 0) return null;
    if (carregando) return <LoadingFooter isLoading={carregando} />;
    if (!temMaisDados && produtos.length > 0) return <EmptyProductState />;
    return null;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF', paddingTop: insets.top }}>
      {erroLocalizacao && produtos.length === 0 ? (
        <TelaErro mensagem={erroLocalizacao} aoTentarNovamente={alternarLocalizacao} />
      ) : (
        <FlatList
          data={produtos}
          initialNumToRender={10}
          windowSize={5}
          renderItem={renderizarItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          style={{ flex: 1 }}
          contentContainerStyle={[
          styles.listaConteudo, 
          { paddingBottom: insets.bottom + 5 } // <--- Isso evita que o último card fique atrás da BottomNavbar
          ]}
          ItemSeparatorComponent={separador}
          ListHeaderComponent={
            <CabecalhoLista
              localizacao={localizacao}
              aoPressionarMercado={handleMercadoPress}
            />
          }
          showsVerticalScrollIndicator={false}
          onEndReached={buscarProdutos}
          onEndReachedThreshold={0.7}
          ListFooterComponent={renderRodape}
        />
      )}
    </View>
  );
}

export const styles = StyleSheet.create({
  listaConteudo: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    flexGrow: 1,
  },
  divisor: {
    height: 16,
  },
  containerCabecalho: {
    width: '100%',
    paddingBottom: 10,
  },
  tituloSecao: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#333333',
    marginTop: 10,
  },
});