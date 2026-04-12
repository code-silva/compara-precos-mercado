const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Busca produtos do backend filtrados por localização, página, busca ou mercado.
 * Mantém o padrão de logs para análise de conexão.
 */
export async function fetchProdutos(
  latitude: number,
  longitude: number,
  page: number = 1,
  query?: string,
  mercadoId?: number
) {

  let url = new URL(`${BASE_URL}/produtos/ofertas/`);
  url.searchParams.append('page', String(page));
  url.searchParams.append('lat', String(latitude));
  url.searchParams.append('lon', String(longitude));

  if (query) url.searchParams.append('q', query);
  if (mercadoId) url.searchParams.append('supermarket_id', String(mercadoId));

  const resposta = await fetch(url);
  return await resposta.json();
}