import { Produto } from '../types/product';

// Busca a URL do seu arquivo .env
const API_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Busca produtos do backend filtrados por localização e página.
 */
export const fetchProdutos = async (
  lat: number, 
  lon: number, 
  page: number = 1
): Promise<Produto[]> => {
  try {
    // 1. Monta a URL (ex: http://192.168.x.x:8000/api/produtos/?lat=-15&lon=-47&page=1)
    const urlCompleta = `${API_URL}/produtos/?lat=${lat}&lon=${lon}&page=${page}`;
    
    console.log("--- TENTANDO CONECTAR ---");
    console.log("URL:", urlCompleta);

    // 2. Faz a chamada ao servidor
    const response = await fetch(urlCompleta);

    // 3. Se o servidor responder com erro (404, 500, etc)
    if (!response.ok) {
      console.error(`ERRO NO SERVIDOR: Status ${response.status}`);
      return [];
    }

    // 4. Converte os dados para JSON
    const dados = await response.json();

    
    // Se o Django usa paginação padrão, os produtos estarão em dados.results
    // Se o Django devolve a lista direta, é apenas dados.
    const produtosFinais = dados.results ? dados.results : dados;

    console.log(`SUCESSO: ${produtosFinais.length} produtos recebidos.`);
    return produtosFinais;

  } catch (error) {
    // 6. Se o servidor estiver desligado ou o IP estiver errado no .env
    console.error("ERRO DE CONEXÃO: Verifique se o Django está rodando e o IP no .env está correto.");
    console.error("Detalhe do erro:", error);
    return [];
  }
};