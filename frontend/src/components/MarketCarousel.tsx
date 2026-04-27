import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { fetchMarkets } from "../api/markets";
import { Market } from "../types/market";
import { CarouselProps } from "../types/market";

const cardMinWidth = 160;
const minCardsVisible = 1;
const nextCardPeek = 0.2;
const cardMarginOffset = 16;

const { width, height } = Dimensions.get("window");
const fittingCards = Math.floor(width / cardMinWidth);
const quantity = Math.max(minCardsVisible, fittingCards);
const divisor = quantity + nextCardPeek;
const cardWidth = width / divisor - cardMarginOffset;

export const MarketCarousel = ({
  coordinates,
  handleMarketPress,
}: CarouselProps & { handleMarketPress: (market: Market) => void }) => {
  const [supermarkets, setSupermarkets] = useState<Market[]>([]);

  useEffect(() => {
    async function loadSupermarkets() {
      if (!coordinates) return;
      let data = await fetchMarkets(
        coordinates.latitude,
        coordinates.longitude,
      );
      setSupermarkets(data.results);
    }
    loadSupermarkets();
  }, [coordinates]);

  const renderItem = ({ item }: { item: Market }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleMarketPress(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mercados Próximos</Text>
      <FlatList
        data={supermarkets}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        horizontal
        ItemSeparatorComponent={() => (
          <View style={{ width: cardMarginOffset }} />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: 8,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    minHeight: 150,
  },
  title: {
    fontSize: 22,
    fontFamily: "Inter-Bold",
    color: "#333333",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#FFFFFF",
    width: cardWidth,
    height: height * 0.15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    boxShadow: "0 2px 4px rgba(99, 12, 12, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 15,
    fontFamily: "Inter-Bold",
    color: "#333333",
    marginBottom: 4,
    textAlign: "center",
  },
});
