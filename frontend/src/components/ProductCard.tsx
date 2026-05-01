import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
  handlePress: (product: Product) => void;
  handleAddToList: (product: Product) => void;
  isGrid?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  handlePress,
  handleAddToList,
  isGrid,
}) => {
  const formattedDistance = React.useMemo(() => {
    if (product.distanceInKilometers === undefined) return null;
    if (product.distanceInKilometers === null) return null;

    const value = Number(product.distanceInKilometers);
    if (value < 1) {
      return `${Math.ceil(value * 1000)} m`;
    }
    return `${value.toFixed(1)} km`;
  }, [product.distanceInKilometers]);

  return (
    <TouchableOpacity
      style={[styles.card, isGrid ? styles.gridStyle : styles.listStyle]}
      onPress={() => handlePress(product)}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image || "https://via.placeholder.com/150" }}
          style={styles.productImage}
          resizeMode="contain"
        />

        <View style={styles.rankingBadge}>
          <Text style={styles.rankingText}>
            #{product.ranking || product.id}
          </Text>
        </View>

        <View
          style={[
            styles.priceLabel,
            isGrid && {
              minWidth: undefined,
              height: 23,
              paddingHorizontal: 6,
              top: 10,
              right: 6,
            },
          ]}
        >
          <Text style={[styles.priceText, isGrid && { fontSize: 11 }]}>
            R$ {Number(product.price).toFixed(2).replace(".", ",")}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.addButton,
            isGrid && { width: 30, height: 30, borderRadius: 15, bottom: 8 },
          ]}
          onPress={() => handleAddToList(product)}
        >
          <MaterialCommunityIcons
            name="playlist-plus"
            size={isGrid ? 20 : 24}
            color="#28a8b5"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <View style={isGrid ? { height: 44, justifyContent: "center" } : null}>
          <Text
            style={[
              styles.productName,
              isGrid && { fontSize: 13, lineHeight: 16 },
            ]}
            numberOfLines={2}
          >
            {product.productName}
          </Text>
        </View>

        <View
          style={
            isGrid
              ? { height: 20, justifyContent: "center", marginTop: 2 }
              : null
          }
        >
          <Text style={styles.brandStyle} numberOfLines={1}>
            {product.brand}
          </Text>
        </View>

        <View style={[styles.footerLine, isGrid && { marginTop: 5 }]}>
          {product.measurementUnit && (
            <View style={styles.weightLabel}>
              <Text style={styles.weightText}>{product.measurementUnit}</Text>
            </View>
          )}

          <Text style={styles.marketName} numberOfLines={1}>
            {product.marketName}
          </Text>
        </View>

        {formattedDistance && (
          <View style={styles.distanceContainer}>
            <MaterialCommunityIcons
              name="map-marker-distance"
              size={12}
              color="#666"
            />
            <Text style={styles.distanceText}>{formattedDistance}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 10,
    elevation: 4,
  },
  listStyle: {
    width: "100%",
    maxWidth: 450,
    alignSelf: "center",
    marginVertical: 12,
  },
  gridStyle: {
    flex: 1,
    margin: 8,
    padding: 8,
    minHeight: 280,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    position: "relative",
    overflow: "hidden",
    borderRadius: 12,
    marginBottom: 5,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: "85%",
    height: "85%",
  },
  productName: {
    fontWeight: "700",
    fontSize: 14,
    color: "#333",
  },
  rankingBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#eee",
    elevation: 2,
  },
  rankingText: {
    fontSize: 10,
    color: "#888",
    fontWeight: "bold",
  },
  priceLabel: {
    minWidth: 65,
    paddingVertical: 4,
    backgroundColor: "#28a8b5",
    borderRadius: 6,
    position: "absolute",
    top: 8,
    right: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  priceText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 12,
  },
  addButton: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  infoContainer: {
    paddingVertical: 4,
    flex: 1,
  },
  brandStyle: {
    fontSize: 11,
    color: "#888",
    textTransform: "uppercase",
  },
  footerLine: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  weightLabel: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginRight: 6,
  },
  weightText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#666",
  },
  marketName: {
    fontSize: 11,
    fontWeight: "700",
    color: "#28a8b5",
    flex: 1,
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  distanceText: {
    fontSize: 11,
    color: "#999",
    marginLeft: 3,
    fontWeight: "600",
  },
});

export default memo(ProductCard);
