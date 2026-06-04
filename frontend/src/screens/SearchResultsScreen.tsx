import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchProducts } from "../api/products";
import { EmptyProductState } from "../components/EmptyProductState";
import { InfoBanner } from "../components/InfoBanner";
import { LoadingFooter } from "../components/LoadingFooter";
import ProductCard from "../components/ProductCard";
import { SearchBar } from "../components/SearchBar";
import type { Product } from "../types/product";

export function SearchResults({ route }: any) {
  const { query, selectedMarket, latitude, longitude } = route.params || {};

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);

  // --- SEARCH HEADER COMPONENT ---
  const SearchHeader = useCallback(
    () => (
      <View style={styles.headerContainer}>
        <SearchBar initialValue={query} />

        {selectedMarket && (
          <View style={styles.marketBanner}>
            <View style={styles.marketLogo}>
              <Text style={styles.marketInitials}>
                {selectedMarket.name[0]}
              </Text>
            </View>
            <View>
              <Text style={styles.marketName}>
                {selectedMarket.name.toUpperCase()}
              </Text>
              <Text style={styles.marketStatus}>OFERTAS DA REDE</Text>
            </View>
          </View>
        )}

        <InfoBanner />

        <Text style={styles.resultsText}>
          {selectedMarket
            ? `Produtos em ${selectedMarket.name}`
            : `Resultados para "${query}"`}
        </Text>
      </View>
    ),
    [query, selectedMarket],
  );

  const fetchData = useCallback(async () => {
    if (isLoading || !hasMoreData) return;

    setIsLoading(true);

    try {
      const newProducts = await fetchProducts(
        latitude || 0,
        longitude || 0,
        page,
        query,
        selectedMarket?.id,
      );
      if (newProducts && newProducts.length > 0) {
        setProducts((prev) => [...prev, ...newProducts]);
        setPage((p) => p + 1);
      } else {
        setHasMoreData(false);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setHasMoreData(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMoreData, page, query, selectedMarket, latitude, longitude]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderFooter = () => {
    if (isLoading) {
      return <LoadingFooter isLoading={isLoading} />;
    }

    if (!hasMoreData && products.length > 0) {
      return <EmptyProductState />;
    }

    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.cardWrapper}>
            <ProductCard
              product={{ ...item, ranking: index + 1 }}
              isGrid={true}
              handlePress={() => console.log("Clicked on product")}
              handleAddToList={() => console.log("Added to list")}
            />
          </View>
        )}
        numColumns={2}
        onEndReached={fetchData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        columnWrapperStyle={styles.gridRow}
        ListHeaderComponent={SearchHeader}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingBottom: 10,
  },
  gridContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  gridRow: {
    justifyContent: "space-between",
  },
  cardWrapper: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  resultsText: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    color: "#333",
    marginVertical: 15,
    marginLeft: 10,
  },
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
