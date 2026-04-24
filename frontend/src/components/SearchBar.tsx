import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, ActivityIndicator, Dimensions, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fetchBuscaHibrida } from '../api/busca';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const IS_ULTRA_NARROW = SCREEN_WIDTH < 330; 
const IS_SMALL = SCREEN_WIDTH < 350;

interface SearchBarProps {
  initialValue?: string;
}

export const SearchBar = ({ initialValue = '' }: SearchBarProps) => {
  const [termo, setTermo] = useState(initialValue);
  const [carregando, setCarregando] = useState(false);
  // O estado das sugestões deve ficar aqui dentro
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [buscaRealizada, setBuscaRealizada] = useState(false);

  useEffect(() => {
    setTermo(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (termo.length < 2) {
      setCarregando(false);
      setSugestoes([]); // Limpa as sugestões se o texto for curto
      setBuscaRealizada(false); // Reseta o estado de busca realizada
      return;
    }

    setCarregando(true);

    const delayBusca = setTimeout(async () => {
    try {
      // MUDANÇA: Usando a função isolada que criamos
      const data = await fetchBuscaHibrida(termo); 
      
      if (data.ofertas) {
  
        const nomesApenas = data.ofertas.map((item: any) => item.nome_produto);
        
        const nomesUnicos = Array.from(new Set(nomesApenas)); 
        setSugestoes(nomesUnicos as string[]);
      }
      setBuscaRealizada(true);
  
    } catch (error) {
      console.error("Erro na busca híbrida:", error);
      setSugestoes([]);
    } finally {
      setCarregando(false);
    }
  }, 500);

  return () => clearTimeout(delayBusca);
}, [termo]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.input,
            { fontSize: IS_ULTRA_NARROW ? 13 : (IS_SMALL ? 14 : 16) }
          ]}
          placeholder="Busque por produtos..."
          placeholderTextColor="#A0AAB2"
          value={termo}
          onChangeText={setTermo}
          autoCapitalize="none"
          underlineColorAndroid="transparent"
        />

        <View style={styles.iconContainer}>
          <View style={styles.shapeLight} />
          <View style={styles.shapeDark} />

          <View style={styles.iconWrapper}>
            {carregando ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
                style={IS_ULTRA_NARROW ? { transform: [{ scale: 0.8 }] } : null}
              />
            ) : (
              <Feather
                name="search"
                size={IS_ULTRA_NARROW ? 18 : (IS_SMALL ? 20 : 24)}
                color="#FFFFFF"
              />
            )}
          </View>
        </View>
      </View>

      {/* --- LISTA DE SUGESTÕES (Z-INDEX 1000) --- */}
      {termo.length >= 2 && sugestoes.length > 0 && (
        <View style={styles.sugestoesContainer}>
          {sugestoes.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.itemSugestao}
              onPress={() => {
                setTermo(item);
                setSugestoes([]); // Limpa ao selecionar
                console.log('Selecionou:', item);
                // Aqui você pode disparar a navegação
              }}
            >
              <Feather name="search" size={16} color="#A0AAB2" style={{ marginRight: 10 }} />
              <Text style={styles.textoSugestao} numberOfLines={1}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* --- CASO NÃO EXISTAM SUGESTÕES --- */}
      {termo.length >= 2 && buscaRealizada && sugestoes.length === 0 && !carregando && (
        <View style={styles.sugestoesContainer}>
          <View style={styles.itemEmpty}>
            <Feather name="help-circle" size={20} color={colors.textPrimary} style={{ marginBottom: 8 }} />
            <Text style={styles.tituloEmpty}>Nenhum resultado encontrado</Text>
            <Text style={styles.subtituloEmpty}>
              Tente verificar a ortografia ou use termos mais simples.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    zIndex: 1000, // Garante que a lista de sugestões fique por cima de tudo
  },
  searchContainer: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E4E8',
    elevation: 3,
    backgroundColor: '#FFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    justifyContent: 'space-between',
  },
  input: {
    flexShrink: 1,
    minWidth: 200,
    paddingLeft: 20,
    color: colors.textPrimary,
  },
  iconContainer: {
    width: IS_ULTRA_NARROW ? 55 : (IS_SMALL ? '20%' : 85),
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shapeLight: {
    position: 'absolute',
    left: -15,
    width: 60,
    height: 100,
    backgroundColor: '#82D2D5',
    transform: [{ rotate: '30deg' }],
  },
  shapeDark: {
    position: 'absolute',
    right: -20,
    width: 80,
    height: 100,
    backgroundColor: '#1EAEB5',
    transform: [{ rotate: '-15deg' }],
  },
  iconWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  // --- NOVOS ESTILOS PARA AS SUGESTÕES ---
  sugestoesContainer: {
    position: 'absolute',
    top: 65, // Ajustado para ficar logo abaixo da barra
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E4E8',
    zIndex: 2000,
    overflow: 'hidden',
  },
  itemSugestao: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  textoSugestao: {
    fontSize: 15,
    color: '#333',
    fontFamily: 'Inter-Regular',
  },
  itemEmpty: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tituloEmpty: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtituloEmpty: {
    fontSize: 13,
    color: '#A0AAB2',
    textAlign: 'center',
    lineHeight: 18,
  },
});
