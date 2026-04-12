import React, { useState, useEffect } from 'react';
import { FlatList, View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CardProduto from '../components/ProductCard'; // Ajuste o caminho
import { Produto } from '../types/product';
import * as Location from 'expo-location';
import { TelaErro } from '../components/TelaErro';
import { EmptyProductState } from '../components/EmptyProductState';
import { useCallback } from 'react';
import { fetchProdutos } from '../api/produtos';
import { SearchBar } from '../components/SearchBar';
import { InfoBanner } from '../components/InfoBanner';
import { CarrosselMercados } from '../components/CarrosselMercados';
import { useNavigation } from '@react-navigation/native';
import { LoadingFooter } from '../components/LoadingFooter';


// FUNÇÕES DE APOIO (Lá fora para performance)

const separador = () => <View style={styles.divisor} />;

// O cabecalho para que o React saiba que ele nunca muda

const chaveUnica = (item: Produto) => item.id.toString();

// Atualizada a interface dentro do React.memo para incluir a nova função
const CabecalhoLista = React.memo(({ 
  localizacao, 
  aoPressionarMercado // <--- Adicione aqui
}: { 
  localizacao: any, 
  aoPressionarMercado: (mercado: any) => void // <--- Defina o tipo aqui
}) => (
  <View style={[styles.containerCabecalho, { alignSelf: 'stretch' }]}>
    <SearchBar />
    {/* Agora passamos a função para a prop que o Carrossel exige */}
    <CarrosselMercados 
      coords={localizacao?.coords} 
      onPressMercado={aoPressionarMercado} 
    />
    <InfoBanner/>
    <Text style={styles.tituloSecao}>Ofertas do Dia</Text>
  </View>
));

export function HomeScreen() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [pagina, setPagina] = useState(1);
  const [carregando, setCarregando] = useState(false);
  const [temMaisDados, setTemMaisDados] = useState(true);
  const [localizacao, setLocalizacao] = useState<Location.LocationObject | null>(null);
  const [erroLocalizacao, setErroLocalizacao] = useState<string | null>(null);

  // funções de ação (useCallback)
  const handlePress = useCallback((produto: Produto) => {
    console.log('Abriu detalhes de:', produto.nome_produto);
    // No futuro, aqui entrará o navigation.navigate('ProductDetails', { produto });
  }, []);

  const handleAdd = useCallback((produto: Produto) => {
    console.log('Adicionou à lista:', produto.nome_produto);
  }, []);

  // Inicializa o objeto de navegação
  const navigation = useNavigation<any>();

  // Cria a função que o TypeScript não estava encontrando
  const handleMercadoPress = useCallback((mercado: any) => {
    // Navega para a tela SearchResults passando os parâmetros necessários
    navigation.navigate('SearchResults', { 
      query: '', // Busca de texto vazia
      mercadoSelecionado: { 
        id: mercado.id, 
        nome: mercado.name || mercado.nome_mercado,
      },
        latitude: localizacao?.coords.latitude,
        longitude: localizacao?.coords.longitude,
    });
  }, [navigation, localizacao]);

  // cálculo derivado apenas para exibição
  const localizacaoUsuario = localizacao
    ? `${localizacao.coords.latitude.toFixed(2)}, ${localizacao.coords.longitude.toFixed(2)}`
    : '...';

  // B. BUSCA SIMPLIFICADA (O que você enviará para o Django)
  const obterLocalizacao = useCallback(async () => {
  setCarregando(true); // Começa carregando
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErroLocalizacao('Precisamos da localização para mostrar as ofertas próximas.');
      return;
    }
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    setLocalizacao(location);
    setErroLocalizacao(null);
  } catch (error) {
    setErroLocalizacao('Não foi possível obter sua localização atual.');
  } finally {
    setCarregando(false); // Termina carregando
  }
}, []); // Função estável

  // função que busca “mais” produtos (mock)
// Substitua a sua função buscarProdutos por esta:
const buscarProdutos = useCallback(async () => {
  // 1. A TRAVA: Não busca se já estiver carregando, se não houver mais dados ou se não tiver GPS
  if (carregando || !temMaisDados || !localizacao) {
    return;
  }

  setCarregando(true);

  try {
    const { latitude, longitude } = localizacao.coords;

    //  CHAMADA REAL: A a função que chama o arquivo api/produtos.ts
    // Passamos lat, lon e a página atual
    const novos = await fetchProdutos(latitude, longitude, pagina);

    // 3. LÓGICA DE ATUALIZAÇÃO:
    if (novos && novos.length > 0) {
      setProdutos(prev => [...prev, ...novos]);
      setPagina(prev => prev + 1);
    } else {
      // Se a API retornar sucesso (200) mas lista vazia
      setTemMaisDados(false);
    }
  } catch (error) {
    // Se a API retornar 404 (Fim das páginas) ou erro de rede
    console.log("Busca finalizada ou erro: ", error);
    setTemMaisDados(false); // <--- A CHAVE PARA PARAR O ACTIVITY INDICATOR
  } finally {
    setCarregando(false);
  }
}, [localizacao, temMaisDados, carregando, pagina]); // Garanta que 'pagina' esteja aqui

  const alternarLocalizacao = useCallback(() => {
  setProdutos([]);
  setPagina(1);
  setTemMaisDados(true);
  obterLocalizacao();
}, [obterLocalizacao]);

  // C. DISPARO INICIAL E TRAVA DE MONTAGEM
  // --- EFEITOS (Corrigidos e Separados) ---

  // 1. Disparo Inicial: Obtém apenas a localização
  useEffect(() => {
    let isMounted = true;

    const inicializar = async () => {
      if (isMounted) {
        await obterLocalizacao();
      }
    };

    inicializar();

    return () => {
      isMounted = false;
    };
  }, [obterLocalizacao]);

  // 2. Segurança: Assim que a localização chegar, se a lista estiver vazia, busca produtos
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

  // --- D. COMPONENTE DE RODAPÉ DINÂMICO ---
  const renderRodape = () => {

  // Se estiver carregando, MAS ainda não houver produtos (carregamento inicial do GPS/App),
  // não mostre nada no rodapé para não confundir o usuário.
  if (carregando && produtos.length === 0) {
    return null;
  }
  // Se estiver carregando E já existirem produtos na tela (pedindo os próximos 14)
  if (carregando) {
    return <LoadingFooter isLoading={carregando} />;
  }

  // 2. Se NÃO estiver carregando E não houver mais dados (chegou ao fim do banco)
  // E você já tem produtos na tela (para não confundir com lista vazia inicial)
  if (!temMaisDados && produtos.length > 0) {
      return <EmptyProductState />;
  }

  return null;
};

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      {erroLocalizacao && produtos.length === 0 ? (
        <TelaErro mensagem={erroLocalizacao}
          aoTentarNovamente={alternarLocalizacao}
        />
      ) : (
        <FlatList
          data={produtos}
          initialNumToRender={10}
          windowSize={5}
          renderItem={renderizarItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          style={{ flex: 1 }}
          contentContainerStyle={[styles.listaConteudo, { minHeight: '100%' }]}
          ItemSeparatorComponent={separador}
          ListHeaderComponent={
            <CabecalhoLista 
              localizacao={localizacao} 
              aoPressionarMercado={handleMercadoPress} 
            />
          }
          showsVerticalScrollIndicator={false}
          onEndReached={buscarProdutos}
          onEndReachedThreshold={0.5}
          maxToRenderPerBatch={5}
          ListFooterComponent={renderRodape}
        />
      )}
    </View>
  );
};

export const styles = StyleSheet.create({
  textoBotao: {
    color: '#FFF',
    fontWeight: 'bold',
  },

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
    minHeight: 300,
  },

  tituloSecao: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#333333',
    marginTop: 10,
  },

  containerVazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  textoVazio: {
    fontSize: 16,
    color: '#888',
  },

  titulo: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
});