import mongoose, { Schema } from "mongoose";

const hotelSchema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true },
    image: { type: String },
    images: [{ type: String }],
    rating: { type: Number, min: 0, max: 5, default: 4.0 },
    amenities: [{ type: String }],
    pricePerNight: { type: Number, required: true },
    description: { type: String },
    address: { type: String },
    rooms: {
      standard: { type: Number, default: 20 },
      deluxe: { type: Number, default: 10 },
      suite: { type: Number, default: 5 },
    },
    features: {
      wifi: { type: Boolean, default: true },
      parking: { type: Boolean, default: true },
      pool: { type: Boolean, default: false },
      gym: { type: Boolean, default: false },
      spa: { type: Boolean, default: false },
      restaurant: { type: Boolean, default: true },
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

hotelSchema.index({ city: 1 });
hotelSchema.index({ pricePerNight: 1 });
hotelSchema.index({ rating: -1 });

export default mongoose.models.Hotel || mongoose.model("Hotel", hotelSchema);
