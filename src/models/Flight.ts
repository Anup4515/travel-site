import mongoose, { Schema } from "mongoose";

const flightSchema = new Schema(
  {
    flightNumber: { type: String, required: true, unique: true },
    airline: { type: String, required: true },
    airlineLogo: { type: String, default: "/images/airplane.png" },
    from: { type: String, required: true },
    to: { type: String, required: true },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    stops: { type: Number, default: 0 },
    class: { type: String, enum: ["economy", "business", "first"], default: "economy" },
    aircraft: { type: String },
    availableSeats: { type: Number, default: 100 },
    amenities: [{ type: String }],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

flightSchema.index({ from: 1, to: 1 });
flightSchema.index({ price: 1 });

export default mongoose.models.Flight || mongoose.model("Flight", flightSchema);
