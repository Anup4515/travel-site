import mongoose, { Schema } from "mongoose";

const cabSchema = new Schema(
  {
    cabName: { type: String, required: true },
    cabType: { type: String, required: true },
    maxSeats: { type: Number, required: true },
    pricePerKm: { type: Number, required: true },
    basePrice: { type: Number, required: true },
    extraHourCharges: { type: Number, required: true },
    features: [{ type: String }],
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Cab || mongoose.model("Cab", cabSchema);
