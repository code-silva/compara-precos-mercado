import { useCallback, useState } from "react";
import { fetchProducts } from "../api/products";
import type { Product } from "../types/product";

interface UseProductsFetchProps {
  latitude?: number;
  longitude?: number;
  query?: string;
  marketId?: number;
}

export function useProductsFetch(props: UseProductsFetchProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    if (isLoading || !hasMoreData) return;

    setIsLoading(true);

    try {
      const response = await fetchProducts(
        props.latitude || 0,
        props.longitude || 0,
        page,
        props.query,
        props.marketId,
      );

      const newProducts = response.results || [];

      if (newProducts.length > 0) {
        setProducts((currentProducts) => [...currentProducts, ...newProducts]);
        setPage((currentPage) => currentPage + 1);

        if (!response.next) setHasMoreData(false);
      } else {
        setHasMoreData(false);
      }
    } catch (_error) {
      setHasMoreData(false);
    }

    setIsLoading(false);
  };

  const resetPagination = useCallback(() => {
    setProducts([]);
    setPage(1);
    setHasMoreData(true);
  }, []);

  return {
    products,
    isLoading,
    hasMoreData,
    fetchData,
    resetPagination,
  };
}
