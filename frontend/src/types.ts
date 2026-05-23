export interface FlightResult {
  id: string;
  code: string;
  airline: string;
  dep: string;
  arr: string;
  duration: string;
  stops: string;
  price: string;
  tag?: 'cheapest' | 'fast' | 'best';
}

export interface HotelResult {
  id: string;
  name: string;
  stars: number;
  rating: string;
  location: string;
  price: string;
  tag: string;
}

export interface PackageResult {
  id: string;
  title: string;
  nights: number;
  includes: string;
  price: string;
  image: string;
}
