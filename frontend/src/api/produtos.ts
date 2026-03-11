import { Produto } from '../types/product';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Busca produtos do backend filtrados por localização e página.
 * Padronizado com a lógica de mercados.ts
 */
export async function fetchProdutos(latitude: number, longitude: number, page: number = 1): Promise<Produto[]> {
  try {
    // 1. Mantém o padrão de sufixo com barra '/' antes dos parâmetros
    let url = `${BASE_URL}/produtos/`;

    // 2. Padroniza os nomes dos parâmetros (latitude/longitude por extenso)
    if (latitude && longitude) {
      url += `?latitude=${latitude}&longitude=${longitude}&page=${page}`;
    } else {
      url += `?page=${page}`;
    }

    console.log("--- TENTANDO CONECTAR PRODUTOS ---");
    console.log("URL:", url);

    const resposta = await fetch(url);

    // 3. Verifica se a conexão foi bem sucedida (Padrão mercado.ts)
    if (!resposta.ok) {
      throw new Error(`Erro no servidor: ${resposta.status}`);
    }

    const dados = await resposta.json();

    // 4. Ajuste para lidar com a paginação do Django (results) ou lista pura
    const produtosFinais = dados.results ? dados.results : dados;

    console.log(`SUCESSO: ${produtosFinais.length} produtos recebidos.`);
    return produtosFinais;

  } catch (erro) {
    // 5. Segue o padrão de log e re-lançamento de erro do mercado.ts
    console.error('Erro na API de produtos:', erro);
    throw erro; 
  }
}