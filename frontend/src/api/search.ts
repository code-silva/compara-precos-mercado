const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchHybridSearch(query: string) {
  // Performs hybrid search (products + markets) based on the typed term

  if (!query) return { offers: [], markets: [], searchTerm: "" };

  const url = new URL(`${BASE_URL}/search/`);
  url.searchParams.append("query", query);

  const response = await fetch(url);
  return await response.json();
}
