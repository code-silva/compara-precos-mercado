const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchProducts(
  latitude: number,
  longitude: number,
  page: number = 1,
  query?: string,
  marketId?: number,
) {
  /**
   * Fetches products from the backend filtered by location, page, search, or market.
   * Maintains the log pattern for connection analysis.
   */

  let url = new URL(`${BASE_URL}/products/offers/`);
  url.searchParams.append("page", String(page));
  url.searchParams.append("latitude", String(latitude));
  url.searchParams.append("longitude", String(longitude));

  if (query) url.searchParams.append("query", query);
  if (marketId) url.searchParams.append("marketId", String(marketId));

  const response = await fetch(url);
  return await response.json();
}
