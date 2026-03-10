import React, { useState, useEffect } from 'react';
import { FlatList, View, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CardProduto from '../../components/ProductCard'; // Ajuste o caminho
import { Produto } from '../../types/product';
import * as Location from 'expo-location';
import { PRODUTOS_TESTE } from '../../mocks/produtosMock';
import { styles } from './HomeScreen.styles';
import { TelaErro } from '../../components/TelaErro';
import { EmptyProductState } from '../../components/EmptyProductState';
import { useCallback } from 'react';

// Ajuste o caminho conforme sua pasta


// FUNÇÕES DE APOIO (Lá fora para performance)

const separador = () => <View style={styles.divisor} />;

// O cabecalho para que o React saiba que ele nunca muda
const cabecalho = React.memo(() => (
  <View style={styles.containerCabecalho}>
    <Text style={styles.titulo}>Referenciar o carrossel de Mercados aqui</Text>
  </View>
));

const chaveUnica = (item: Produto) => item.id.toString();


const HomeScreen = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [pagina, setPagina] = useState(1);
  const [carregando, setCarregando] = useState(false);
  const [temMaisDados, setTemMaisDados] = useState(true);
  const [localizacao, setLocalizacao] = useState<Location.LocationObject | null>(null);
  const [erroLocalizacao, setErroLocalizacao] = useState<string | null>(null);

  // cálculo derivado apenas para exibição
  const localizacaoUsuario = localizacao
    ? `${localizacao.coords.latitude.toFixed(2)}, ${localizacao.coords.longitude.toFixed(2)}`
    : '...';

  // B. BUSCA SIMPLIFICADA (O que você enviará para o Django)
  const obterLocalizacao = useCallback(async () => {
  if (carregando) return; 
  setCarregando(true);
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErroLocalizacao('Precisamos da localização para mostrar as ofertas próximas.');
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    setLocalizacao(location);
    setErroLocalizacao(null);
  } catch (error) {
    setErroLocalizacao('Não foi possível obter sua localização atual.');
  } finally {
    setCarregando(false);
  }
}, [carregando]); // Só muda se o estado de carregando mudar

  // função que busca “mais” produtos (mock)
const buscarProdutos = useCallback(async () => {
  // 1. A TRAVA (DEBOUNCE)
  if (carregando || !temMaisDados || !localizacao) {
    return; 
  }

  // 2. O BLOQUEIO IMEDIATO
  setCarregando(true);

  try {
    const { latitude, longitude } = localizacao.coords;
    
    // Simulação de chamada ao Backend (Django)
    await new Promise(res => setTimeout(res, 1500));
    
    const LIMITE = 14;
    const inicio = (pagina - 1) * LIMITE;
    const fim = pagina * LIMITE;
    const novos = PRODUTOS_TESTE.slice(inicio, fim);

    if (novos.length > 0) {
      setProdutos(prev => [...prev, ...novos]);
      setPagina(prev => prev + 1);
    } else {
      setTemMaisDados(false);
    }
  } catch (error) {
    console.error("Erro na busca:", error);
  } finally {
    // 3. A LIBERAÇÃO
    setCarregando(false);
  }
}, [carregando, temMaisDados, localizacao, pagina]); // <--- Dependências importantes!

  const alternarLocalizacao = useCallback(() => {
  setProdutos([]);
  setPagina(1);
  setTemMaisDados(true);
  obterLocalizacao();
}, [obterLocalizacao]);

  // C. DISPARO INICIAL E TRAVA DE MONTAGEM
useEffect(() => {
  let isMounted = true; // 1. Criamos a variável de controle

  const inicializar = async () => {
    // Só prossegue se o componente ainda estiver na tela
    if (isMounted) {
      await obterLocalizacao();
    }
  };

  inicializar();

  // 2. FUNÇÃO DE CLEANUP: Executada quando o usuário sai da tela
  return () => {
    isMounted = false; 
  };
}, []);

  useEffect(() => {
    if (localizacao) buscarProdutos();
  }, [localizacao]);

  const renderizarItem = useCallback(({ item }: { item: Produto }) => (
  <CardProduto
    produto={item}
    aoPressionar={() => console.log('Abriu detalhes de:', item.nome_produto)}
    aoAdicionarNaLista={() => console.log('Adicionou:', item.nome_produto, 'à lista de compras')}
  />
), []);

  // --- D. COMPONENTE DE RODAPÉ DINÂMICO ---
  const renderRodape = () => {

  // Se estiver carregando, MAS ainda não houver produtos (carregamento inicial do GPS/App),
  // não mostre nada no rodapé para não confundir o usuário.
  if (carregando && produtos.length === 0) {
    return null;
  }
  // Se estiver carregando E já existirem produtos na tela (pedindo os próximos 14)
  if (carregando) {
    return (
      <View style={{ paddingVertical: 30, alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#28a8b5" />
        <Text style={{ marginTop: 10, color: '#28a8b5' }}>Carregando mais ofertas...</Text>
      </View>
    );
  }

  // 2. Se NÃO estiver carregando E não houver mais dados (chegou ao fim do banco)
  // E você já tem produtos na tela (para não confundir com lista vazia inicial)
  if (!temMaisDados && produtos.length > 0) {
      return <EmptyProductState />;
  }

  return null;
};

  return (
    <SafeAreaView style={styles.tela}>
      {/* Lógica de Renderização Condicional */}
      {erroLocalizacao && produtos.length === 0 ? (
        <TelaErro mensagem={erroLocalizacao}
          aoTentarNovamente={alternarLocalizacao}        
        />
      ) : (
        <FlatList
          data={produtos}
          initialNumToRender={14}
          renderItem={renderizarItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          ItemSeparatorComponent={separador}
          ListHeaderComponent={cabecalho}
          removeClippedSubviews={true}
          contentContainerStyle={styles.listaConteudo}
          showsVerticalScrollIndicator={false}
          onEndReached={buscarProdutos}
          onEndReachedThreshold={0.1}
          maxToRenderPerBatch={14}
          ListEmptyComponent={!carregando && produtos.length === 0 ? EmptyProductState : null}
          ListFooterComponent={renderRodape}
        />
      )}

      {/* Botão Flutuante (Opcional: aparece apenas se não houver erro crítico) */}
      {!erroLocalizacao && (
        <TouchableOpacity style={styles.botaoFlutuante} onPress={alternarLocalizacao}>
          <Text style={styles.textoBotao}>📍 Local: {localizacaoUsuario}</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;