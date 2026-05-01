export interface Market {
  id: number;
  name: string;
  state: string;
  city: string;
  distanceInKilometers: number | null;
  nameColor: null | string;
}

export interface CarouselProps {
  coordinates?: {
    latitude: number;
    longitude: number;
  } | null;

  handleMarketPress: (market: Market) => void;
}
