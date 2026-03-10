export interface Produto {
  id: number; // Vem da table 'produto' campo 'id', para identificar um produto específico
  nome_produto: string; // Vem da table 'produto' campo 'nome', para exibir o nome do produto, lembrar de aplicar o alias no backend para evitar confusão com o nome do campo 'nome' da tabela 'mercadomatriz'
  preco: number;
  nome_mercado: string; // Vem da table 'mercadomatriz' campo 'nome' ou filial, mas acredito ser o matriz, aplicar o alias no backend para evitar confusão com o nome do campo 'nome' da tabela 'produto'
  marca: string;
  imagem: string;
  unidade_medida: string;
  distancia?: string;
}