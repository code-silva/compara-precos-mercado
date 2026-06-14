import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { Market } from "../types/market";

// CONSTANTS
const cardMinWidth = 160;
const minCardsVisible = 1;
const nextCardPeek = 0.2;
const cardMarginOffset = 16;

const { width, height } = Dimensions.get("window");
const fittingCards = Math.floor(width / cardMinWidth);
const quantity = Math.max(minCardsVisible, fittingCards);
const divisor = quantity + nextCardPeek;
const cardWidth = width / divisor - cardMarginOffset;

// INTERFACES
export interface CarouselProps {
  markets: Market[];
  handleMarketPress: (market: Market) => void;
}

// COMPONENT
export const MarketCarousel = (props: CarouselProps) => {
  const renderItem = ({ item }: { item: Market }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => props.handleMarketPress(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.name}>{item.name}</Text>
      {!!item.address && <Text style={styles.address}>{item.address}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mercados Próximos</Text>
      <FlatList
        data={props.markets}
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

// STYLES
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
    marginBottom: 2,
    textAlign: "center",
  },
  address: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#666666",
    textAlign: "center",
  },
});
