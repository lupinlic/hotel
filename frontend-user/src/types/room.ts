export interface Room {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;

  view: string;
  size: number;
  bed_type: string;

  maxAdults: number;
  maxChildren: number;

  amenities: string[];
}