import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export const InfoBanner = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="info" size={40} color={colors.infoIcon} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Info</Text>
        <Text style={styles.description}>
          O seguinte app utiliza a extração de dados e preços via IA, que está sujeita a erros. Por favor, confira nossos termos de uso.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.infoBackground,
    borderRadius: 8,
    marginVertical: 10,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: colors.infoBorder,
    alignItems: 'center',
  },

  iconContainer: {
    marginRight: 15,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },

  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});