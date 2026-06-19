import { Image, StyleSheet, Text, View } from "react-native";

const flagsMapping: Record<string, number> = {
  "gama sul": require("../assets/flags/ra_gama.jpg"),
  "gama centro": require("../assets/flags/ra_gama.jpg"),
};

interface DistrictBadgeProps {
  address?: string;
}

export function DistrictBadge({ address }: DistrictBadgeProps) {
  if (!address) return null;

  const normalizedAddress = address.toLowerCase().trim();
  const matchedKey = Object.keys(flagsMapping).find((key) =>
    normalizedAddress.includes(key),
  );
  const flagImage = matchedKey ? flagsMapping[matchedKey] : undefined;

  return (
    <View style={styles.badgeContainer}>
      {!!flagImage && <Image source={flagImage} style={styles.flagIcon} />}
      <Text style={styles.badgeText}>{address}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F7F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EAEFEF",
  },
  flagIcon: {
    width: 24,
    height: 16,
    marginRight: 6,
    resizeMode: "cover",
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "Inter-Medium",
    color: "#555555",
  },
});
