import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

// Pegamos a largura da tela para criar regras de responsividade
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Definição de breakpoints para facilitar a leitura
const IS_ULTRA_NARROW = SCREEN_WIDTH < 330; // Ex: Galaxy Fold (tela externa)
const IS_SMALL = SCREEN_WIDTH < 350;       // Ex: iPhone SE

export const SearchBar = () => {
  const [termo, setTermo] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (termo.length < 2) {
      setCarregando(false);
      return;
    }

    setCarregando(true);

    const delayBusca = setTimeout(async () => {
      try {
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/busca/?q=${termo}`);
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
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
                // Diminui o loading no Fold para não quebrar o layout
                style={IS_ULTRA_NARROW ? { transform: [{ scale: 0.8 }] } : null}
              />
            ) : (
              <Feather
                name="search"
                // Ícone ainda menor para o Fold
                size={IS_ULTRA_NARROW ? 18 : (IS_SMALL ? 20 : 24)}
                color="#FFFFFF"
              />
            )}
          </View>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },

  searchContainer: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E4E8',
    elevation: 3,
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
    fontFamily: 'Inter-Regular',
  },

  iconContainer: {
    // AJUSTE CRÍTICO PARA O FOLD:
    // Em telas ultra estreitas, fixamos uma largura mínima pequena (55px)
    // para garantir que o input tenha espaço, mas o ícone ainda caiba.
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
  // Ocupa todo o espaço do iconContainer
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  // Centraliza o conteúdo (ícone ou activity indicator) no meio exato
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10, // Garante que fique acima das formas coloridas
  }
});