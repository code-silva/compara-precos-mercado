import { Produto } from '../types/product';

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
): Promise<Produto[]> {
  try {
    // 1. Iniciamos a URL com o endpoint base
    let url = `${BASE_URL}/produtos/ofertas/`;

    // 2. Construímos os parâmetros dinamicamente para evitar erros de sintaxe (? vs &)
    // Usamos uma array para juntar tudo no final com '?' e '&'
    const params = [];
    params.push(`page=${page}`);

    if (latitude && longitude) {
      params.push(`lat=${latitude}`);
      params.push(`lon=${longitude}`);
    }

    if (query) {
      params.push(`q=${encodeURIComponent(query)}`);
    }

    if (mercadoId) {
      params.push(`mercado_id=${mercadoId}`);
    }

    // Monta a URL final: /produtos/ofertas/?page=1&lat=...
    url += `?${params.join('&')}`;

    // --- LOGS DE ANÁLISE ---
    console.log("--- TENTANDO CONECTAR PRODUTOS ---");
    console.log("URL:", url);

    const resposta = await fetch(url);

    // 3. Verifica se a conexão foi bem sucedida
    if (!resposta.ok) {
      console.log(`ERRO DE CONEXÃO: Status ${resposta.status}`);
      throw new Error(`Erro no servidor: ${resposta.status}`);
    }

    const dados = await resposta.json();

    // 4. Ajuste para lidar com a paginação do Django (results) ou lista pura
    const produtosFinais = dados.results ? dados.results : dados;

    // --- LOG DE SUCESSO ---
    console.log(`SUCESSO: ${produtosFinais.length} produtos recebidos.`);
    
    return produtosFinais;

  } catch (erro) {
    // 5. Log de erro para diagnóstico no terminal
    console.log('--- FALHA NA REQUISIÇÃO ---');
    console.log('Motivo:', erro instanceof Error ? erro.message : 'Conexão finalizada ou sem mais dados.');
    return [];
  }
}