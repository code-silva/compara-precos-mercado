import { StyleSheet, Text, View } from "react-native";

interface MarketBannerProps {
  marketName: string;
  subtitle: string;
}

export function MarketBanner({ marketName, subtitle }: MarketBannerProps) {
  const firstLetter = marketName ? marketName[0].toUpperCase() : "?";
  const displayName = marketName ? marketName.toUpperCase() : "LOADING...";

  return (
    <View style={styles.marketBanner}>
      <View style={styles.marketLogo}>
        <Text style={styles.marketInitials}>{firstLetter}</Text>
      </View>
      <View>
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
    marginRight: 5,
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
});
