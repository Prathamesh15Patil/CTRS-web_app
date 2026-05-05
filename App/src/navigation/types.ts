// src/navigation/types.ts

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  HotelDetails: { hotelId: string, hotelName: string, rating:number, deliveryTime: string, discount: string };
  Cart: { hotelId: string, discount: string, deliveryTime: string , hotelName: string };
  Billing: { hotelId: string, deliveryTime: string, hotelName: string  };
  Rating: { hotelId: string, hotelName: string };
};

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Hotel {
  id: string;
  name: string;
  image: string;
  discount: string;
  rating: number;
  deliveryTime: string;
}

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
}