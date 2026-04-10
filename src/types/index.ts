import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "user" | "admin";
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  interface User {
    role?: "user" | "admin";
  }
}

export interface IFlight {
  _id: string;
  flightNumber: string;
  airline: string;
  airlineLogo: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  stops: number;
  class: "economy" | "business" | "first";
  aircraft?: string;
  availableSeats?: number;
  amenities?: string[];
  active?: boolean;
}

export interface IHotel {
  _id: string;
  name: string;
  location: string;
  city: string;
  image?: string;
  images?: string[];
  rating: number;
  amenities: string[];
  pricePerNight: number;
  description?: string;
  address?: string;
  rooms?: { standard: number; deluxe: number; suite: number };
  features?: {
    wifi: boolean;
    parking: boolean;
    pool: boolean;
    gym: boolean;
    spa: boolean;
    restaurant: boolean;
  };
  active?: boolean;
}

export interface IItineraryItem {
  day: number;
  title: string;
  description: string;
  highlights?: string[];
  duration?: string;
  meals?: string;
  travel?: string;
}

export interface IPackage {
  _id: string;
  packageId: string;
  name: string;
  destination: string;
  cities: string[];
  image?: string;
  images?: string[];
  duration: string;
  durationDays: number;
  durationNights: number;
  price: number;
  description: string;
  shortDescription?: string;
  category: string;
  difficulty?: string;
  bestFor?: string;
  included?: string[];
  excluded?: string[];
  itinerary: IItineraryItem[];
  highlights?: string[];
  featured?: boolean;
  active?: boolean;
}

export interface ICab {
  _id: string;
  cabName: string;
  cabType: string;
  maxSeats: number;
  pricePerKm: number;
  basePrice: number;
  extraHourCharges: number;
  features: string[];
  image: string;
}

export interface IBooking {
  _id: string;
  userId: string;
  status: "confirmed" | "cancelled" | "pending";
  createdAt: string;
}

export interface IFlightBooking extends IBooking {
  flightNumber: string;
  departure: string;
  arrival: string;
  date: string;
  passengers: number;
  price: number;
}

export interface IHotelBooking extends IBooking {
  hotelName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  price: number;
}

export interface IPackageBooking extends IBooking {
  packageName: string;
  destination: string;
  startDate: string;
  travelers: number;
  price: number;
}

export interface ICabBooking extends IBooking {
  cabName: string;
  cabType: string;
  pickupLocation: string;
  dropoffLocation?: string;
  pickupDateTime: string;
  passengers: number;
  price: number;
}

export interface IRestaurant {
  name: string;
  rating: number | null;
  reviewCount: number;
  address: string;
  location: { lat: number; lng: number };
  distance: string;
  photo: string;
  placeId: string;
  mapsLink: string;
  types: string[];
  isOpen: boolean | null;
}
