import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CardProduto from '../components/ProductCard';
import { fetchProdutos } from '../api/produtos';
import { Produto } from '../types/product';
import { EmptyProductState } from '../components/EmptyProductState';
import { LoadingFooter } from '../components/LoadingFooter';
import { SearchBar } from '../components/SearchBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function StoreProductsScreen({ route }: any) {

  const insets = useSafeAreaInsets();
  
  console.log("DEBUG FEIRIX - O que tem no mercadoSelecionado:", route.params?.mercadoSelecionado);  

  const { mercadoSelecionado, latitude, longitude } = route.params || {};

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [temMaisDados, setTemMaisDados] = useState(true);

  const buscarDados = useCallback(async () => {
    if (carregando || !temMaisDados) return;
    setCarregando(true);

    try {
      // Busca específica pelo ID do mercado clicado na Home
      const resposta = await fetchProdutos(
        latitude || 0,
        longitude || 0,
        pagina,
        undefined, // Sem query de texto aqui
        mercadoSelecionado.id
      );

      const novos = resposta.results || [];
      if (novos.length > 0) {
        setProdutos(prev => [...prev, ...novos]);
        setPagina(p => p + 1);
        if (!resposta.next) setTemMaisDados(false);
      } else {
        setTemMaisDados(false);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos do mercado:', error);
      setTemMaisDados(false);
    } finally {
      setCarregando(false);
    }
  }, [pagina, carregando, temMaisDados, mercadoSelecionado.id]);

  useEffect(() => {
    buscarDados();
  }, []);

  const Cabecalho = () => {

  const nomeReal = mercadoSelecionado?.name || mercadoSelecionado?.nome_mercado || "";  
  // Verificação de segurança: se não tiver nome, usa uma string vazia
  const primeiraLetra = nomeReal ? nomeReal[0].toUpperCase() : "?";
  const nomeExibicao = nomeReal ? nomeReal.toUpperCase() : "CARREGANDO...";

  return (
    <View style={styles.headerContainer}>
    
      <View style={styles.mercadoBanner}>
        <View style={styles.mercadoLogo}>
          {/* Aqui estava o erro: usamos a variável segura agora */}
          <Text style={styles.mercadoSigla}>{primeiraLetra}</Text>
        </View>
        <View>
          <Text style={styles.mercadoNome}>{nomeExibicao}</Text>
          <Text style={styles.mercadoStatus}>OFERTAS DESTA UNIDADE</Text>
        </View>
      </View>
    </View>
  );
};

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#FFF', 
      paddingTop: insets.top 
    }}>

      <View style={{ zIndex: 10, backgroundColor: '#FFF', paddingHorizontal: 20, paddingBottom: 15 }}>
        <SearchBar />
      </View>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.cardWrapper}>
            <CardProduto 
              produto={{...item, ranking: index + 1}} 
              ehGrade={true}
              aoPressionar={() => console.log('Detalhes')}
              aoAdicionarNaLista={() => console.log('Add Lista')}
            />
          </View>
        )}
        numColumns={2}
        columnWrapperStyle={styles.linhaGrade}
        ListHeaderComponent={Cabecalho}
        ListFooterComponent={() => <LoadingFooter isLoading={carregando} />}
        onEndReached={buscarDados}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.containerGrade}
      />
    </View>
  );
}

// Reutilize os estilos da sua SearchResults (mercadoBanner, cardWrapper, etc)
const styles = StyleSheet.create({
  headerContainer: {
    paddingBottom: 10,
  },
  containerGrade: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  linhaGrade: {
    justifyContent: 'flex-start',
  },
  cardWrapper: {
    flex: 1, 
    maxWidth: '50%',// Garante que dois cards caibam com respiro no meio
    marginHorizontal: 5,
    marginBottom: 10,
  },
  resultadosTexto: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginVertical: 15,
    marginLeft: 10,
  },
  // ESTILO DO BANNER DE MERCADO (Imagem 2)
  mercadoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  mercadoSigla: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#28a8b5', // Cor principal do Feirix
  },
  mercadoLogo: {
    width: 80,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  mercadoNome: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#000',
  },
  mercadoStatus: {
    fontSize: 10,
    color: '#28a8b5',
    fontFamily: 'Inter-Bold',
  }
});