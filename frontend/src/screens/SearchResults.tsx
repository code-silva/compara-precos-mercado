import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CardProduto from '../components/ProductCard';
import { SearchBar } from '../components/SearchBar';
import { InfoBanner } from '../components/InfoBanner';
import { fetchProdutos } from '../api/produtos';
import { Produto } from '../types/product';
import { EmptyProductState } from '../components/EmptyProductState';
import { LoadingFooter } from '../components/LoadingFooter';


export function SearchResults({ route }: any) {
  // Recebe o termo de busca ou o ID do mercado via navegação
  const { query, mercadoSelecionado, latitude, longitude } = route.params || {};

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [temMaisDados, setTemMaisDados] = useState(true);

  // --- COMPONENTE DE CABEÇALHO DA BUSCA ---
  const CabecalhoBusca = useCallback(() => (
    <View style={styles.headerContainer}>
      <SearchBar initialValue={query} />
      
      {/* Se houver um mercado selecionado, mostra o banner dele */}
      {mercadoSelecionado && (
        <View style={styles.mercadoBanner}>
          <View style={styles.mercadoLogo}>
             <Text style={styles.mercadoSigla}>{mercadoSelecionado.nome[0]}</Text>
          </View>
          <View>
            <Text style={styles.mercadoNome}>{mercadoSelecionado.nome.toUpperCase()}</Text>
            <Text style={styles.mercadoStatus}>OFERTAS DA REDE</Text>
          </View>
        </View>
      )}

      <InfoBanner />
      
      <Text style={styles.resultadosTexto}>
        {mercadoSelecionado ? `Produtos em ${mercadoSelecionado.nome}` : `Resultados para "${query}"`}
      </Text>
    </View>
  ), [query, mercadoSelecionado]);

  // Função de busca (Aproveita a lógica da Home)
  const buscarDados = async () => {

    if (carregando || !temMaisDados) return;

    setCarregando(true);

    try {
      // Aqui você passa o query ou mercadoId para sua API
      const novos = await fetchProdutos(
        latitude || 0, 
        longitude || 0, 
        pagina, 
        query, 
        mercadoSelecionado?.id
    );
      if (novos && novos.length > 0) {
      setProdutos(prev => [...prev, ...novos]);
      setPagina(p => p + 1);
      } 
    
      else {
      setTemMaisDados(false);
      }
    } catch (error) { 
      console.error('Erro ao buscar produtos:', error);
      setTemMaisDados(false); // Para evitar chamadas infinitas em caso de erro
    }
    finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarDados();
  }, []);

  const renderRodape = () => {
  // 1. Enquanto busca novos itens no Django
  if (carregando) {
    return (
      <LoadingFooter isLoading={carregando} />
    );
  }

  // 2. Quando a API não tem mais itens e a lista não está vazia
  if (!temMaisDados && produtos.length > 0) {
    return <EmptyProductState />;
  }

  return null;
};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.cardWrapper}>
             <CardProduto 
              produto={{...item, ranking: index + 1}} 
              ehGrade={true}
              aoPressionar={() => console.log('Clicou no produto')}
              aoAdicionarNaLista={() => console.log('Adicionou à lista')}
             />
          </View>
        )}
        numColumns={2}
        onEndReached={buscarDados}
        onEndReachedThreshold={0.5} 
        ListFooterComponent={renderRodape}
        columnWrapperStyle={styles.linhaGrade}
        ListHeaderComponent={CabecalhoBusca}
        contentContainerStyle={styles.containerGrade}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingBottom: 10,
  },
  containerGrade: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  linhaGrade: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    flex: 1, // Garante que dois cards caibam com respiro no meio
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