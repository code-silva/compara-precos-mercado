import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  Image,
  type ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OnboardingButton } from "../components/OnboardingButton";
import { OnboardingDots } from "../components/OnboardingDots";
import { colors } from "../theme/colors";

const SCALE_BASE = 375;
const SMALL_SCREEN_HEIGHT = 700;
const ILLUSTRATION_SCALE_SMALL = 0.55;
const ILLUSTRATION_SCALE_LARGE = 0.72;
const TITLE_FONT_SIZE = 24;
const DESCRIPTION_FONT_SIZE = 14;
const HEADER_TITLE_FONT_SIZE = 20;
const SKIP_BACK_FONT_SIZE = 16;
const CLOSE_ICON_SIZE = 24;
const PADDING_TOP_OFFSET = 10;
const PADDING_TOP_MIN = 40;
const PADDING_BOTTOM_OFFSET = 20;
const PADDING_BOTTOM_MIN = 40;

interface OnboardingStep {
  title: string;
  description: string;
  image: ImageSourcePropType;
}

const ONBOARDING_DATA: OnboardingStep[] = [
  {
    title: "Bem-vindo ao Compara Preços!",
    description:
      "Reunimos os principais supermercados da sua região em um só lugar para você encontrar as melhores ofertas sem sair de casa.",
    image: require("../assets/stickman_1-removebg-preview.png"),
  },
  {
    title: "Ofertas perto de você",
    description:
      "Utilizamos inteligência artificial para extrair dados e preços atualizados dos encartes. Ative sua geolocalização para visualizar os mercados e produtos mais próximos do seu endereço.",
    image: require("../assets/stickman_2-removebg-preview.png"),
  },
  {
    title: "Compare antes de comprar",
    description:
      "Use a barra de busca para encontrar marcas ou produtos específicos. Clique no item e veja um comparativo em tempo real com outros mercados da mesma região no mesmo instante.",
    image: require("../assets/stickman_3.png"),
  },
  {
    title: "Monte sua Lista Personalizada",
    description:
      "Ao encontrar o que deseja, clique em adicionar para montar sua lista de compras. Planeje seus gastos com antecedência e garanta a maior economia no fechamento do caixa.",
    image: require("../assets/stickman_4-removebg-preview.png"),
  },
];

type RootStackParamList = {
  // biome-ignore lint/style/useNamingConvention: route names use PascalCase
  OnboardingLocal: undefined;
  // biome-ignore lint/style/useNamingConvention: route names use PascalCase
  MainTabs: undefined;
};

type OnboardingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "OnboardingLocal"
>;

export const OnboardingLocal = ({
  navigation,
}: {
  navigation: OnboardingScreenNavigationProp;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scale = Math.min(width, SCALE_BASE) / SCALE_BASE;
  const isSmallScreen = height < SMALL_SCREEN_HEIGHT;

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
  const illustrationSize = isSmallScreen
    ? width * ILLUSTRATION_SCALE_SMALL
    : width * ILLUSTRATION_SCALE_LARGE;
  const titleSize = Math.round(TITLE_FONT_SIZE * scale);
  const descriptionSize = Math.round(DESCRIPTION_FONT_SIZE * scale);
  const paddingTop = Math.max(insets.top + PADDING_TOP_OFFSET, PADDING_TOP_MIN);

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <MaterialIcons
            name="close"
            size={CLOSE_ICON_SIZE}
            color={colors.primary}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            { fontSize: Math.round(HEADER_TITLE_FONT_SIZE * scale) },
          ]}
        >
          Compara Preços
        </Text>
        <TouchableOpacity onPress={handleClose} style={styles.skipButton}>
          <Text
            style={[
              styles.skipText,
              { fontSize: Math.round(SKIP_BACK_FONT_SIZE * scale) },
            ]}
          >
            Pular
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <View
            style={[styles.illustrationContainer, { width: illustrationSize }]}
          >
            <Image
              source={step.image}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={[styles.title, { fontSize: titleSize }]}>
              {step.title}
            </Text>
            <Text style={[styles.description, { fontSize: descriptionSize }]}>
              {step.description}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View
        style={[
          styles.footer,
          {
            paddingBottom: Math.max(
              insets.bottom + PADDING_BOTTOM_OFFSET,
              PADDING_BOTTOM_MIN,
            ),
          },
        ]}
      >
        <OnboardingDots
          activeStep={currentStep}
          totalSteps={ONBOARDING_DATA.length}
        />
        <View style={styles.buttonRow}>
          {currentStep > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text
                style={[
                  styles.backButtonText,
                  { fontSize: Math.round(SKIP_BACK_FONT_SIZE * scale) },
                ]}
              >
                Voltar
              </Text>
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
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
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
    fontWeight: "600",
  },
  headerTitle: {
    fontWeight: "bold",
    color: colors.primary,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  illustrationContainer: {
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    alignItems: "center",
    textAlign: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontWeight: "700",
    color: colors.onSurface,
    textAlign: "center",
    marginBottom: 12,
  },
  description: {
    color: colors.onSurfaceVariant,
    textAlign: "center",
    lineHeight: 20,
  },
  footer: {
    width: "100%",
    alignItems: "center",
    gap: 16,
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
    fontWeight: "600",
  },
});
