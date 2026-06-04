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
    title: "Bem-vindo ao Compara Preços!",
    description:
      "Reunimos os principais supermercados da sua região in um só lugar para você encontrar as melhores ofertas sem sair de casa.",
    image: require("../assets/stickman_1.png"),
  },
  {
    title: "Ofertas perto de você",
    description:
      "Utilizamos inteligência artificial para extrair dados e preços atualizados dos encartes. Ative sua geolocalização para visualizar os mercados e produtos mais próximos do seu endereço.",
    image: require("../assets/stickman_2.jpeg"),
  },
  {
    title: "Compare antes de comprar",
    description:
      "Use a barra de busca para encontrar marcas ou produtos específicos. Clique no item e veja um comparativo em tempo real com outros mercados da mesma região no mesmo instante.",
    image: require("../assets/stickman_1.png"), // Fallback usando a imagem 1
  },
  {
    title: "Monte sua Lista Personalizada",
    description:
      "Ao encontrar o que deseja, clique em adicionar para montar sua lista de compras. Planeje seus gastos com antecedência e garanta a maior economia no fechamento do caixa.",
    image: require("../assets/stickman_1.png"), // Fallback usando a imagem 1
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
  image: {
    width: "100%",
    height: "100%",
    zIndex: 10,
    borderRadius: 32,
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
