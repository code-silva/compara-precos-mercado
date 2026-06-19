import { Image, StyleSheet, Text, View } from "react-native";

interface DistrictBadgeProps {
  address?: string;
}

export function DistrictBadge({ address }: DistrictBadgeProps) {
  if (!address) return null;

  const normalizedAddress = address.toLowerCase().trim();
  const hasFlag =
    normalizedAddress.includes("gama sul") ||
    normalizedAddress.includes("gama centro");

  return (
    <View style={styles.badgeContainer}>
      {hasFlag && (
        <Image
          source={require("../assets/flags/ra_gama.jpg")}
          style={styles.flagIcon}
          resizeMode="contain"
        />
      )}
      <Text style={styles.badgeText}>{address}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  flagIcon: {
    width: 16,
    height: 12,
    marginRight: 4,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#666666",
  },
});
