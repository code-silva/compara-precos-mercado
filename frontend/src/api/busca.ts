const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Realiza a busca híbrida (produtos + mercados) baseada no termo digitado.
 */
export async function fetchBuscaHibrida(query: string) {
  if (!query) return { ofertas: [], mercados: [], termo_buscado: "" };

  // Formato da URL que testamos no navegador: /api/busca/?q=termo
  let url = new URL(`${BASE_URL}/busca/`);
  url.searchParams.append('q', query);

  try {
    const resposta = await fetch(url);
    const dados = await resposta.json();
    return dados;
  } catch (error) {
    console.error("Erro na busca híbrida:", error);
    return { ofertas: [], mercados: [], termo_buscado: query };
  }
}