import { MaterialIcons } from "@expo/vector-icons";
import type React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../theme/colors";

interface OnboardingButtonProps {
  title: string;
  onPress: () => void;
}

export const OnboardingButton: React.FC<OnboardingButtonProps> = ({
  title,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Text style={styles.text}>{title}</Text>
      <MaterialIcons name="arrow-forward" size={20} color={colors.onPrimary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    // Shadow for iOS
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    // Elevation for Android
    elevation: 4,
  },

  text: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
});
