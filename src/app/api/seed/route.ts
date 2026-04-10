import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Flight from "@/models/Flight";
import Hotel from "@/models/Hotel";
import Package from "@/models/Package";
import Cab from "@/models/Cab";
import User from "@/models/User";

const flights = [
  { flightNumber: "AI-302", airline: "Air India", airlineLogo: "/images/airindia.png", from: "New Delhi", to: "Mumbai", departureTime: "06:30", arrivalTime: "08:45", duration: "2h 15m", price: 4599, stops: 0, class: "economy", aircraft: "Airbus A320neo", availableSeats: 150, amenities: ["Wi-Fi", "Meals Included", "30kg Baggage"] },
  { flightNumber: "6E-201", airline: "IndiGo", airlineLogo: "/images/indigo.png", from: "New Delhi", to: "Mumbai", departureTime: "09:15", arrivalTime: "11:30", duration: "2h 15m", price: 3899, stops: 0, class: "economy", aircraft: "Airbus A320", availableSeats: 180, amenities: ["30kg Baggage"] },
  { flightNumber: "6E-2045", airline: "IndiGo", airlineLogo: "/images/indigo.png", from: "Delhi", to: "Agra", departureTime: "07:00", arrivalTime: "08:15", duration: "1h 15m", price: 2599, stops: 0, class: "economy", aircraft: "ATR 72", availableSeats: 70, amenities: ["20kg Baggage"] },
  { flightNumber: "AI-419", airline: "Air India", airlineLogo: "/images/airindia.png", from: "Agra", to: "Jaipur", departureTime: "10:30", arrivalTime: "11:45", duration: "1h 15m", price: 2799, stops: 0, class: "economy", aircraft: "ATR 72", availableSeats: 68, amenities: ["Meals Included", "20kg Baggage"] },
  { flightNumber: "SG-2821", airline: "SpiceJet", airlineLogo: "/images/spicejet.png", from: "Jaipur", to: "Delhi", departureTime: "16:00", arrivalTime: "17:15", duration: "1h 15m", price: 2499, stops: 0, class: "economy", aircraft: "Boeing 737", availableSeats: 189, amenities: ["20kg Baggage"] },
];

const hotels = [
  { name: "Taj Palace Hotel", location: "Agra, India", city: "Agra", image: "/images/agra2.jpg", rating: 4.8, amenities: ["Wi-Fi", "Pool", "Restaurant", "Taj View", "Spa"], pricePerNight: 7999, description: "Luxury hotel with stunning views of the Taj Mahal", address: "Taj East Gate Road, Agra, UP 282001", features: { wifi: true, parking: true, pool: true, gym: true, spa: true, restaurant: true } },
  { name: "The Lalit New Delhi", location: "New Delhi, India", city: "Delhi", image: "/images/delhi2.jpg", rating: 4.7, amenities: ["Wi-Fi", "Spa", "Gym", "Multiple Restaurants", "Business Center"], pricePerNight: 8999, description: "5-star luxury in the heart of New Delhi", address: "Barakhamba Avenue, Connaught Place, New Delhi 110001", features: { wifi: true, parking: true, pool: true, gym: true, spa: true, restaurant: true } },
  { name: "Rambagh Palace", location: "Jaipur, India", city: "Jaipur", image: "/images/jaipur4.jpg", rating: 4.9, amenities: ["Wi-Fi", "Heritage Property", "Fine Dining", "Royal Experience", "Palace Tours"], pricePerNight: 15999, description: "Former royal palace turned luxury heritage hotel", address: "Bhawani Singh Road, Jaipur, Rajasthan 302005", features: { wifi: true, parking: true, pool: true, gym: true, spa: true, restaurant: true } },
  { name: "Heritage Haveli", location: "Jaipur, India", city: "Jaipur", image: "/images/jaipur3.jpg", rating: 4.7, amenities: ["Wi-Fi", "Pool", "Heritage Tour", "Restaurant"], pricePerNight: 5999, description: "Restored 200-year-old haveli with royal charm", address: "MI Road, Jaipur, Rajasthan", features: { wifi: true, parking: true, pool: true, gym: false, spa: false, restaurant: true } },
];

const packages = [
  { packageId: "gt-classic", name: "Golden Triangle Classic", destination: "Golden Triangle", cities: ["Delhi", "Agra", "Jaipur"], image: "/images/tajmahal.jpg", duration: "4 Days / 3 Nights", durationDays: 4, durationNights: 3, price: 14999, description: "Experience India's most iconic Golden Triangle circuit.", category: "golden-triangle", featured: true, difficulty: "easy", bestFor: "First-time visitors", highlights: ["Taj Mahal at Sunrise", "Red Fort & Qutub Minar", "Amber Fort & City Palace", "Hawa Mahal"], included: ["3 nights accommodation", "Daily breakfast", "All transfers by AC vehicle", "Professional guide", "Monument entry fees"], excluded: ["Flight tickets", "Lunch and dinner", "Personal expenses"], itinerary: [{ day: 1, title: "Arrival in Delhi", description: "Explore Red Fort, Jama Masjid, Chandni Chowk.", highlights: ["Red Fort", "Jama Masjid"], duration: "8 hours", meals: "Dinner", travel: "30 km" }, { day: 2, title: "Delhi to Agra", description: "Visit Qutub Minar, drive to Agra.", highlights: ["Qutub Minar", "Humayun's Tomb"], duration: "10 hours", meals: "Breakfast, Dinner", travel: "230 km" }, { day: 3, title: "Agra to Jaipur", description: "Sunrise Taj Mahal, Agra Fort, Fatehpur Sikri.", highlights: ["Taj Mahal", "Agra Fort"], duration: "12 hours", meals: "Breakfast, Dinner", travel: "240 km" }, { day: 4, title: "Jaipur Sightseeing", description: "Amber Fort, City Palace, Hawa Mahal.", highlights: ["Amber Fort", "City Palace"], duration: "9 hours", meals: "Breakfast", travel: "40 km" }] },
  { packageId: "gt-heritage", name: "Golden Triangle Heritage Tour", destination: "Golden Triangle", cities: ["Delhi", "Agra", "Jaipur"], image: "/images/jaipur.jpg", duration: "5 Days / 4 Nights", durationDays: 5, durationNights: 4, price: 22999, description: "Extended tour with heritage hotels and cultural experiences.", category: "golden-triangle", featured: true, difficulty: "easy", bestFor: "Heritage lovers", highlights: ["Extended Delhi Sightseeing", "Rajasthani Cultural Evening", "Heritage Hotels"], included: ["4 nights heritage hotels", "Daily breakfast + 2 dinners", "All transfers", "Professional guide", "Monument entry fees", "Cultural evening"], excluded: ["Flight tickets", "Lunch", "Personal expenses"], itinerary: [{ day: 1, title: "Arrival in Delhi", description: "Old Delhi tour.", highlights: ["Red Fort", "Jama Masjid"] }, { day: 2, title: "New Delhi", description: "Qutub Minar, Humayun's Tomb, India Gate.", highlights: ["Qutub Minar", "India Gate"] }, { day: 3, title: "Delhi to Agra", description: "Taj Mahal and Agra Fort.", highlights: ["Taj Mahal", "Agra Fort"] }, { day: 4, title: "Agra to Jaipur", description: "Fatehpur Sikri, cultural evening.", highlights: ["Fatehpur Sikri"] }, { day: 5, title: "Jaipur & Departure", description: "Amber Fort, City Palace, Hawa Mahal.", highlights: ["Amber Fort", "City Palace"] }] },
  { packageId: "gt-luxury", name: "Golden Triangle Luxury Tour", destination: "Golden Triangle", cities: ["Delhi", "Agra", "Jaipur"], image: "/images/indiagate.jpg", duration: "6 Days / 5 Nights", durationDays: 6, durationNights: 5, price: 45999, description: "Luxury experience with 5-star accommodations.", category: "golden-triangle", featured: true, difficulty: "easy", bestFor: "Luxury travelers", highlights: ["5-Star Hotels", "Private Guides", "Fine Dining", "Spa & Wellness"], included: ["5 nights 5-star hotels", "All meals", "Private chauffeur", "Private guide", "All entry fees", "Spa sessions", "Fine dining", "Airport transfers"], excluded: ["Flight tickets", "Personal expenses"], itinerary: [{ day: 1, title: "Arrival in Delhi", description: "VIP airport reception, 5-star check-in, spa.", highlights: ["Luxury Hotel", "Spa"] }, { day: 2, title: "Old Delhi", description: "Private Red Fort tour, gourmet lunch.", highlights: ["Red Fort", "Gourmet Lunch"] }, { day: 3, title: "New Delhi & Agra", description: "UNESCO sites, luxury transfer to Agra.", highlights: ["UNESCO Sites", "Luxury Transfer"] }, { day: 4, title: "Taj Mahal", description: "Private sunrise tour, champagne breakfast.", highlights: ["Taj Mahal", "Champagne Breakfast"] }, { day: 5, title: "Agra to Jaipur", description: "Fatehpur Sikri, palace hotel, royal dinner.", highlights: ["Fatehpur Sikri", "Royal Dinner"] }, { day: 6, title: "Jaipur & Departure", description: "Amber Fort VIP, fine dining, shopping.", highlights: ["Amber Fort VIP", "Fine Dining"] }] },
];

const cabs = [
  { cabName: "Suzuki Dzire", cabType: "Sedan", maxSeats: 4, pricePerKm: 11, basePrice: 2000, extraHourCharges: 200, features: ["AC", "80km Limit", "Music System"], image: "/images/dzire.jpg" },
  { cabName: "Toyota Etios", cabType: "Sedan", maxSeats: 4, pricePerKm: 11, basePrice: 2000, extraHourCharges: 200, features: ["AC", "80km Limit", "Comfortable"], image: "/images/etios.jpg" },
  { cabName: "Toyota Innova", cabType: "SUV", maxSeats: 6, pricePerKm: 16, basePrice: 2400, extraHourCharges: 300, features: ["AC", "Spacious", "Carrier"], image: "/images/innova.jpg" },
  { cabName: "Toyota Crysta", cabType: "SUV", maxSeats: 7, pricePerKm: 18, basePrice: 3000, extraHourCharges: 350, features: ["Premium AC", "Luxury Seats", "Touchscreen"], image: "/images/crysta.jpg" },
  { cabName: "Toyota Fortuner", cabType: "Luxury", maxSeats: 7, pricePerKm: 45, basePrice: 6500, extraHourCharges: 700, features: ["VIP Look", "High Safety", "Leather Interior"], image: "/images/fortuner.jpg" },
  { cabName: "12+1 Tempo Traveller", cabType: "Tempo Traveller", maxSeats: 13, pricePerKm: 24, basePrice: 6000, extraHourCharges: 450, features: ["Pushback Seats", "Music System", "Group Travel"], image: "/images/tempo12.jpg" },
  { cabName: "16+1 Tempo Traveller", cabType: "Tempo Traveller", maxSeats: 17, pricePerKm: 26, basePrice: 6000, extraHourCharges: 500, features: ["Large Group", "Ample Luggage", "AC"], image: "/images/tempo16.jpg" },
];

export async function POST() {
  try {
    await dbConnect();

    await Promise.all([Flight.deleteMany({}), Hotel.deleteMany({}), Package.deleteMany({}), Cab.deleteMany({})]);

    const [f, h, p, c] = await Promise.all([
      Flight.insertMany(flights),
      Hotel.insertMany(hotels),
      Package.insertMany(packages),
      Cab.insertMany(cabs),
    ]);

    // Create admin user if doesn't exist
    const adminEmail = process.env.ADMIN_EMAIL || "admin12@gmail.com";
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({ name: "Admin", email: adminEmail, password: process.env.ADMIN_PASSWORD || "admin", role: "admin", authMethod: "email" });
    }

    return NextResponse.json({
      message: "Database seeded successfully",
      counts: { flights: f.length, hotels: h.length, packages: p.length, cabs: c.length },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Seed failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
