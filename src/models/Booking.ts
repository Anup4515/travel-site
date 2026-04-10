import mongoose, { Schema } from "mongoose";

const flightBookingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    flightNumber: { type: String, required: true },
    departure: { type: String, required: true },
    arrival: { type: String, required: true },
    date: { type: String, required: true },
    passengers: { type: Number, default: 1 },
    price: { type: Number, required: true },
    status: { type: String, enum: ["confirmed", "cancelled", "pending"], default: "confirmed" },
  },
  { timestamps: true }
);

const hotelBookingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    hotelName: { type: String, required: true },
    location: { type: String, required: true },
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
    guests: { type: Number, default: 1 },
    price: { type: Number, required: true },
    status: { type: String, enum: ["confirmed", "cancelled", "pending"], default: "confirmed" },
  },
  { timestamps: true }
);

const packageBookingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    packageName: { type: String, required: true },
    destination: { type: String, required: true },
    startDate: { type: String, required: true },
    travelers: { type: Number, default: 1 },
    price: { type: Number, required: true },
    status: { type: String, enum: ["confirmed", "cancelled", "pending"], default: "confirmed" },
  },
  { timestamps: true }
);

const cabBookingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    cabId: { type: Schema.Types.ObjectId, ref: "Cab" },
    cabName: { type: String },
    cabType: { type: String },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String },
    pickupDateTime: { type: String, required: true },
    passengers: { type: Number, default: 1 },
    price: { type: Number, required: true, default: 0 },
    notes: { type: String },
    status: { type: String, enum: ["confirmed", "cancelled", "pending"], default: "confirmed" },
  },
  { timestamps: true }
);

const restaurantCacheSchema = new Schema({
  city: { type: String, required: true, lowercase: true },
  dish: { type: String, required: true, lowercase: true },
  restaurants: { type: Array, default: [] },
  lastUpdated: { type: Date, default: Date.now },
});
restaurantCacheSchema.index({ city: 1, dish: 1 });

export const FlightBooking =
  mongoose.models.FlightBooking || mongoose.model("FlightBooking", flightBookingSchema);
export const HotelBooking =
  mongoose.models.HotelBooking || mongoose.model("HotelBooking", hotelBookingSchema);
export const PackageBooking =
  mongoose.models.PackageBooking || mongoose.model("PackageBooking", packageBookingSchema);
export const CabBooking =
  mongoose.models.CabBooking || mongoose.model("CabBooking", cabBookingSchema);
export const RestaurantCache =
  mongoose.models.RestaurantCache || mongoose.model("RestaurantCache", restaurantCacheSchema);
