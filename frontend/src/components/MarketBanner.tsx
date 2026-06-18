import { StyleSheet, Text, View, Image } from "react-native";

const flagsMapping: Record<string, any> = {
  "gama sul": require("../assets/flags/ra_gama.jpg"),
};

interface MarketBannerProps {
  marketName: string;
  subtitle: string;
  address?: string; 
}

export function MarketBanner({ marketName, subtitle, address }: MarketBannerProps) {
  const firstLetter = marketName ? marketName[0].toUpperCase() : "?";
  const displayName = marketName ? marketName.toUpperCase() : "LOADING...";
  const normalizedAddress = address ? address.toLowerCase().trim() : "";
  const flagImage = flagsMapping[normalizedAddress];

  return (
    <View style={styles.marketBanner}>
      <View style={styles.marketLogo}>
        <Text style={styles.marketInitials}>{firstLetter}</Text>
      </View>

    <View style={styles.textContainer}>
        
        {!!address && (
          <View style={styles.badgeContainer}>
            {!!flagImage && <Image source={flagImage} style={styles.flagIcon} />}
            <Text style={styles.badgeText}>{address}</Text>
          </View>
        )}

        <Text style={styles.marketName}>{displayName}</Text>
        <Text style={styles.marketStatus}>{subtitle}</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  marketBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start", 
  },
  marketInitials: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#28a8b5",
  },
  marketLogo: {
    width: 80,
    height: 50,
    borderRadius: 30,
    backgroundColor: "#f8f8f8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  marketName: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#000",
  },
  marketStatus: {
    fontSize: 10,
    color: "#28a8b5",
    fontFamily: "Inter-Bold",
  },
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
    width: 18,
    height: 12,
    marginRight: 6,
    resizeMode: "contain",
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "Inter-Regular", 
    color: "#555555",
  },
});
