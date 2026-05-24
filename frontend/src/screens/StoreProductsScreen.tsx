import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchProducts } from "../api/products";
import { EmptyProductState } from "../components/EmptyProductState";
import { LoadingFooter } from "../components/LoadingFooter";
import { ProductGrid } from "../components/ProductGrid";
import { SearchBar } from "../components/SearchBar";
import type { Product } from "../types/product";

export function StoreProductsScreen({ route }: any) {
  const insets = useSafeAreaInsets();
  const { selectedMarket, latitude, longitude } = route.params || {};

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);

  const fetchData = useCallback(async () => {
    if (isLoading || !hasMoreData) return;
    setIsLoading(true);

    try {
      const response = await fetchProducts(
        latitude || 0,
        longitude || 0,
        page,
        undefined,
        selectedMarket.id,
      );

      const newProducts = response.results || [];
      if (newProducts.length > 0) {
        setProducts((prev) => [...prev, ...newProducts]);
        setPage((p) => p + 1);
        if (!response.next) setHasMoreData(false);
      } else {
        setHasMoreData(false);
      }
    } catch (error) {
      console.error("Error fetching market products:", error);
      setHasMoreData(false);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMoreData, selectedMarket.id, latitude, longitude]);

  useEffect(() => {
    fetchData();
  }, []);

  const Header = () => {
    const actualName = selectedMarket?.name || selectedMarket?.marketName || "";
    const firstLetter = actualName ? actualName[0].toUpperCase() : "?";
    const displayName = actualName ? actualName.toUpperCase() : "LOADING...";

    return (
      <View style={styles.headerContainer}>
        <View style={styles.marketBanner}>
          <View style={styles.marketLogo}>
            <Text style={styles.marketInitials}>{firstLetter}</Text>
          </View>
          <View>
            <Text style={styles.marketName}>{displayName}</Text>
            <Text style={styles.marketStatus}>OFERTAS DESTA UNIDADE</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (isLoading) {
      return <LoadingFooter isLoading={isLoading} />;
    }
    if (!isLoading && products.length === 0 && !hasMoreData) {
      return <EmptyProductState />;
    }
    if (!isLoading && !hasMoreData && products.length > 0) {
      return <EmptyProductState />;
    }
    return null;
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF",
        paddingTop: insets.top,
      }}
    >
      <View
        style={{
          zIndex: 10,
          backgroundColor: "#FFF",
          paddingHorizontal: 14,
          paddingBottom: 10,
        }}
      >
        <SearchBar />
      </View>

      <ProductGrid
        products={products}
        handlePress={(product) =>
          console.log("Details for:", product.productName)
        }
        handleAddToList={(product) =>
          console.log("Add to List:", product.productName)
        }
        onEndReached={fetchData}
        onEndReachedThreshold={0.7}
        ListHeaderComponent={<Header />}
        ListFooterComponent={renderFooter()}
        contentContainerStyle={styles.gridContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    paddingBottom: 10,
  },
  gridContainer: {
    paddingHorizontal: 14,
    flexGrow: 1,
  },
  marketBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFF",
    marginHorizontal: 0,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EEE",
    alignSelf: "stretch",
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
