const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// Função utilizada para requisitar os dados de mercados próximos ao usuário
export async function fetchMercados() {
  try {
    const resposta = await fetch(`${BASE_URL}/mercados-proximos/`);

    // Verifica se a conexão com o servidor foi bem sucedida
    if (!resposta.ok) {
      throw new Error(`Erro no servidor: ${resposta.status}`);
    }

    // Retorna os dados dos mercados
    const dados = await resposta.json();
    return dados;

    // Em caso de erros diversos
    } catch (erro) {
        console.error('Erro na API de mercados:', erro);
        throw erro;
    }
};