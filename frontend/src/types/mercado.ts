export interface Mercado {
  id: number;
  name: string;
  uf: string;
  city: string;
  distance_km: number | null;
  name_color: null | string;
}

export interface CarrosselProps {
  coords?: {
    latitude: number;
    longitude: number;
  } | null;

  onPressMercado: (mercado: Mercado) => void
}
