const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchMarkets(latitude?: number, longitude?: number) {
  // Function used to request supermarkets close to the user

  let url = new URL(`${BASE_URL}/nearby-markets/`);
  url.searchParams.append("latitude", String(latitude));
  url.searchParams.append("longitude", String(longitude));

  const response = await fetch(url);
  return await response.json();
}
