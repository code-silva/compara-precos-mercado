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
        />

        <View style={styles.iconContainer}>
          {carregando ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Feather name="search" size={24} color="#FFFFFF" />
          )}
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
  },
  iconContainer: {
    width: 65,
    backgroundColor: '#2CB3B1',
    justifyContent: 'center',
    alignItems: 'center',
  }
});