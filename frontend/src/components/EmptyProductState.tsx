import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

interface EmptyProductStateProps {
  isEndOfList?: boolean; 
}

export const EmptyProductState = ({ isEndOfList = false }: EmptyProductStateProps) => (
  <View style={[styles.container, isEndOfList && styles.containerEnd]}>
    {isEndOfList ? (
      <>
        <View style={styles.iconRow}>
          <View style={styles.stickmanWrapper}>
            <Feather name="check" size={16} color="#A0AAB2" style={styles.topIcon} />
            <Feather name="user" size={32} color="#A0AAB2" />
          </View>
        </View>
        <Text style={styles.title}>Você chegou ao fim das ofertas.</Text>
        <Text style={styles.subtitle}>
          Ufa! Você percorreu todas as nossas ofertas atuais.
        </Text>
      </>
    ) : (
      <>
        <Text style={styles.icon}>🔍</Text>
        <Text style={styles.title}>Nenhum produto encontrado</Text>
        <Text style={styles.subtitle}>
          Não encontramos ofertas para este termo ou localização. Tente mudar a busca ou atualizar a lista.
        </Text>
      </>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 40,
  },
  containerEnd: {
    marginTop: 10,
    paddingBottom: 40,
    opacity: 0.8,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  stickmanWrapper: {
    alignItems: 'center',
  },
  topIcon: {
    marginBottom: -2,
    marginLeft: 20,
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 30,
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter-Bold",
    color: "#333",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    maxWidth: '80%',
  },
});