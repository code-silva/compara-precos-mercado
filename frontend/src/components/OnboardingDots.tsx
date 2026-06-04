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
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        // biome-ignore lint/suspicious/noArrayIndexKey: static list with no unique ids
        return (
          <View
            key={`dot-${index}`}
            style={[
              styles.dot,
              index === activeStep ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        );
      })}
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
