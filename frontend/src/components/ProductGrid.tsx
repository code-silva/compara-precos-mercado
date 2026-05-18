import React from "react";
import { FlatList, StyleSheet, useWindowDimensions, View } from "react-native";
import type { Product } from "../types/product";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  handlePress: (product: Product) => void;
  handleAddToList: (product: Product) => void;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
  contentContainerStyle?: any;
}

const BREAKPOINTS = {
  TABLET_LARGE: 1024,
  TABLET_STANDARD: 768,
  MOBILE_STANDARD: 320,
};

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  handlePress,
  handleAddToList,
  onEndReached,
  onEndReachedThreshold,
  ListFooterComponent,
  ListHeaderComponent,
  ListEmptyComponent,
  contentContainerStyle,
}) => {
  const { width } = useWindowDimensions();

  // This function calculates the number of columns for the grid based on the current screen width and predefined breakpoints. It ensures that the grid is responsive and adapts to different device sizes, providing an optimal layout for users on mobile, tablet, and larger screens.
  const getNumColumns = (): number => {
    if (width >= BREAKPOINTS.TABLET_LARGE) return 4;
    if (width >= BREAKPOINTS.TABLET_STANDARD) return 3;
    if (width >= BREAKPOINTS.MOBILE_STANDARD) return 2;
    return 1;
  };

  const numColumns = getNumColumns();

  return (
    <FlatList
      data={products}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      renderItem={({ item, index }) => (
        <View style={[styles.cardWrapper, { maxWidth: `${100 / numColumns}%` }]}>
          <ProductCard
            product={item}
            ranking={index + 1}
            handlePress={handlePress}
            handleAddToList={handleAddToList}
          />
        </View>
      )}
      key={`grid-${numColumns}`}
      numColumns={numColumns}
      
      //
      columnWrapperStyle={numColumns > 1 ? styles.rowWrapper : null}
      contentContainerStyle={[styles.listContainer, contentContainerStyle]}      
      // 
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      ListFooterComponent={ListFooterComponent}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 6,
  },
  rowWrapper: {
    justifyContent: "flex-start", 
    flexDirection: "row",
    width: "100%",
  },
  cardWrapper: {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 0,
    padding: 6, 
  },
});