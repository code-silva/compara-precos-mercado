export interface Product {
  id: number;
  productName: string;
  price: string;
  marketName: string;
  brand: string;
  image: string;
  measurementUnit: string;
  measurement: string;
  categoryName: string;
  distanceInKilometers?: number;
  ranking?: number;
}

export interface ProductCardProps {
  product: Product;
  handlePress: (product: Product) => void;
  ranking?: number;
  handleAddToList: (product: Product) => void;
  isGrid?: boolean;
}
