export interface Mercado {
  id: number;
  nome: string;
  latitude: number;
  longitude: number;
  uf: string;
  cidade: string;
  distancia_km: number | null;
  cor_nome: null | string;
}