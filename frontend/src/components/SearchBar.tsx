import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

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
          style={styles.input}
          placeholder="Search ..."
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
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Feather name="search" size={24} color="#FFFFFF" />
            )}
          </View>
        </View>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 25, 
    overflow: 'hidden', 
    borderWidth: 1,
    borderColor: '#E0E4E8',
    elevation: 3, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    flex: 1,
    paddingLeft: 20,
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: 'Inter_400Regular',
    outlineStyle: 'none' as any,
  },
  iconContainer: {
    width: 85,
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
    right: 15,
    justifyContent: 'center',
    alignItems: 'center',
  }
});