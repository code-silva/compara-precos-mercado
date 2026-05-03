import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons"; 

export const EmptyProductState = () => (
  <View style={styles.container}>
    <View style={styles.iconRow}>
      <View style={styles.stickmanWrapper}>
        <Feather name="check" size={18} color="#A0AAB2" style={styles.topIcon} />
        <Feather name="user" size={32} color="#A0AAB2" />
      </View>
    </View>

    <Text style={styles.title}>Você chegou ao fim das ofertas.</Text>
    <Text style={styles.subtitle}>
      Ufa! Você percorreu todas as nossas ofertas atuais.
    </Text> 
  </View>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 20,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'flex-end', 
    marginBottom: 15,
  },
  icon: {
    fontSize: 30,
    marginRight: 10, 
  },
  stickmanWrapper: {
    alignItems: 'center',
  },
  questionMark: {
    fontSize: 16,
    color: "#A0AAB2",
    fontWeight: "bold",
    marginBottom: -6, 
    marginLeft: 15,   
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
  },
});