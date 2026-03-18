export interface Room {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;

  view: string;
  size: number;
  bed: string;

  maxAdults: number;
  maxChildren: number;

  amenities: string[];
}