import type React from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../theme/colors";

interface OnboardingDotsProps {
  activeStep: number;
  totalSteps: number;
}

export const OnboardingDots: React.FC<OnboardingDotsProps> = ({
  activeStep,
  totalSteps,
}) => {
  const dotKeys = Array.from({ length: totalSteps }, (_, i) => `dot-${i}`);
  return (
    <View style={styles.container}>
      {dotKeys.map((key, index) => (
        <View
          key={key}
          style={[
            styles.dot,
            index === activeStep ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    height: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    borderRadius: 4,
    height: 8,
  },
  activeDot: {
    width: 24,
    backgroundColor: colors.primary,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: colors.outlineVariant,
  },
});
