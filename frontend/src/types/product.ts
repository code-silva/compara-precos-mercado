export interface Produto {
  id: number;
  nome_produto: string;
  preco: string; // O Django envia Decimal como string no JSON para precisão
  nome_mercado: string;
  marca: string;
  imagem: string;
  unidade_medida: string;
  medida: string;
  nome_categoria: string;
  distancia_km?: number; // Ajustado para bater com o Serializer do backend
  ranking?: number;
}