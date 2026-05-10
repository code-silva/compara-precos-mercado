import { useNavigation } from "@react-navigation/native";
import type * as Location from "expo-location";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchMarkets } from "../api/markets";
import { fetchProducts } from "../api/products";
import { EmptyProductState } from "../components/EmptyProductState";
import { HomeHeader } from "../components/HomeScreenHeader";
import { LoadingFooter } from "../components/LoadingFooter";
import ProductCard from "../components/ProductCard";
import type { Market } from "../types/market";
import type { Product } from "../types/product";

// SUPPORT FUNCTIONS
const renderSeparator = () => <View style={styles.separator} />;

export function HomeScreen({location}: {location: Location.LocationObject}) {
  const insets = useSafeAreaInsets();
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [markets, setMarkets] = useState<Market[]>([]);
  const navigation = useNavigation<any>();

  // ACTION WHEN CLICKING ON PRODUCT
  const handlePress = useCallback((product: Product) => {
    console.log("Opened details for:", product.productName);
  }, []);

  const handleAdd = useCallback((product: Product) => {
    console.log("Added to list:", product.productName);
  }, []);

  // NAVIGATION TO SPECIFIC MARKET SCREEN
  const handleMarketPress = useCallback(
    (market: Market) => {
      navigation.navigate("StoreProducts", {
        selectedMarket: {
          id: market.id,
          name: market.name,
        },
        latitude: location?.coords.latitude,
        longitude: location?.coords.longitude,
      });
    },
    [location, navigation],
  );

  // FETCHING GENERAL PRODUCTS
  const fetchProductsData = useCallback(async () => {
    if (isLoading || !hasMoreData) return;

    setIsLoading(true);
    try {
      const { latitude, longitude } = location?.coords ?? {};

      const response = await fetchProducts(latitude, longitude, page);
      console.log(response);

      const newProducts = response.results || [];
      const nextPage = response.next;

      if (newProducts.length > 0) {
        setProducts((prev) => [...prev, ...newProducts]);
        if (nextPage === null) {
          setHasMoreData(false);
        } else {
          setPage((prev) => prev + 1);
        }
      } else {
        setHasMoreData(false);
      }
    } catch (error) {
      console.log("Error fetching products on Home:", error);
      setHasMoreData(false);
    } finally {
      setIsLoading(false);
    }
  }, [location, hasMoreData, isLoading, page]);

  // EFFECTS
  useEffect(() => {
    if (location && products.length === 0 && !isLoading && hasMoreData) {
      fetchProductsData();
    }
  }, [location, products.length, isLoading, hasMoreData, fetchProductsData]);

  useEffect(() => {
    async function loadMarkets() {
      if (!location) return;

      const data = await fetchMarkets(
        location.coords.latitude,
        location.coords.longitude,
      );

      setMarkets(data.results);
    }

    loadMarkets();
  }, [location]);

  const renderItem = useCallback(
    ({ item, index }: { item: Product; index: number }) => (
      <ProductCard
        product={{ ...item, ranking: index + 1 }}
        handlePress={() => handlePress(item)}
        handleAddToList={() => handleAdd(item)}
      />
    ),
    [handlePress, handleAdd],
  );

  const renderFooter = () => {
    if (isLoading && products.length === 0) return null;
    if (isLoading) return <LoadingFooter isLoading={isLoading} />;
    if (!hasMoreData && products.length > 0) return <EmptyProductState />;
    return null;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF", paddingTop: insets.top }}>
      <FlatList
        data={products}
        initialNumToRender={10}
        windowSize={5}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 5 },
        ]}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={
          <HomeHeader
            markets={markets}
            handleMarketPress={handleMarketPress}
          />
        }
        showsVerticalScrollIndicator={false}
        onEndReached={fetchProductsData}
        onEndReachedThreshold={0.7}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
}

export const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    flexGrow: 1,
  },
  separator: {
    height: 16,
  },
});
