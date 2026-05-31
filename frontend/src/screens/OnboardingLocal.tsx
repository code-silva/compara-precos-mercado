import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { OnboardingButton } from "../components/OnboardingButton";
import { OnboardingDots } from "../components/OnboardingDots";
import { colors } from "../theme/colors";

const { width } = Dimensions.get("window");

interface OnboardingStep {
  title: string;
  description: string;
  image: any; // Agora aceita URI ou require
}

const ONBOARDING_DATA: OnboardingStep[] = [
  {
    title: 'Bem-vindo ao Feirix',
    description: 'Encontre as melhores ofertas de supermercados da sua região de forma rápida e simples.',
    image: { uri: 'https://via.placeholder.com/300' }, 
  },
  {
    title: 'Ofertas perto de você',
    description: 'Utilizamos inteligência artificial para extrair dados e preços atualizados dos encartes. Ative sua geolocalização para visualizar os mercados e produtos mais próximos do seu endereço.',
    image: { uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGGUd_nrAK47hE2bjf8pmtcSQlwYuI6Fo2pzpLFvkiRazvZi2x1Eczf6JkOKiC3O9obsML7buiQ9gNu1FITE1TAveFIISw1rD1zO-UZRuPNBS_fNKtkXSULDfyNC4GO4bXxI3psNFxiE23cYE02NfvnDZ7Y4MgUKqT_tbJSwzYbUfbYP4qkXA3xkLi_H8VtehK62HOIwxxOOG6YpN0LApd41UmzwiQLxkca-aIZOceRYVS8zmiR40_UxgT2mTE1zyqZ0j0L1agbK1K' },
  },
  {
    title: 'Economize tempo e dinheiro',
    description: 'Compare preços entre diferentes mercados e monte sua lista de compras inteligente.',
    image: { uri: 'https://via.placeholder.com/300' },
  },
  {
    title: 'Tudo na palma da mão',
    description: 'Acompanhe as promoções em tempo real e não perca mais nenhuma oportunidade de economizar.',
    image: { uri: 'https://via.placeholder.com/300' },
  },
];

type RootStackParamList = {
  OnboardingLocal: undefined;
  MainTabs: undefined;
};

type OnboardingScreenRouteProp = RouteProp<
  RootStackParamList,
  "OnboardingLocal"
>;
type OnboardingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "OnboardingLocal"
>;

export const OnboardingLocal = ({
  navigation,
}: {
  navigation: OnboardingScreenNavigationProp;
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const finishOnboarding = async () => {
    try {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
    } catch (error) {
      console.error("Error saving onboarding status:", error);
    }
    navigation.replace("MainTabs");
  };

  const handleNext = () => {
    if (currentStep < ONBOARDING_DATA.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    finishOnboarding();
  };

  const step = ONBOARDING_DATA[currentStep];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Compara Preços</Text>
        <TouchableOpacity onPress={handleClose} style={styles.skipButton}>
          <Text style={styles.skipText}>Pular</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.illustrationContainer}>
          <View style={styles.glow} />
          <Image
            source={step.image}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.description}>{step.description}</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <OnboardingDots
          activeStep={currentStep}
          totalSteps={ONBOARDING_DATA.length}
        />
        <View style={styles.buttonRow}>
          {currentStep > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
          )}
          <OnboardingButton title="Próximo" onPress={handleNext} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  skipButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  skipText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  illustrationContainer: {
    width: width * 0.8,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  glow: {
    position: "absolute",
    width: "80%",
    height: "80%",
    backgroundColor: colors.secondaryContainer,
    borderRadius: 100,
    opacity: 0.2,
  },
  image: {
    width: "100%",
    height: "100%",
    zIndex: 10,
  },
  textContainer: {
    alignItems: "center",
    textAlign: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.onSurface,
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: "center",
    lineHeight: 20,
  },
  footer: {
    width: "100%",
    alignItems: "center",
    gap: 24,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "100%",
  },
  backButton: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
