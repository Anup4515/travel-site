import mongoose, { Schema } from "mongoose";

const itineraryItemSchema = new Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  highlights: [{ type: String }],
  duration: { type: String },
  meals: { type: String },
  travel: { type: String },
});

const reviewSchema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true },
  comment: { type: String, required: true },
  helpful: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const packageSchema = new Schema(
  {
    packageId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    destination: { type: String, required: true },
    cities: [{ type: String }],
    image: { type: String },
    images: [{ type: String }],
    duration: { type: String, required: true },
    durationDays: { type: Number, required: true },
    durationNights: { type: Number, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    category: {
      type: String,
      enum: ["golden-triangle", "heritage", "adventure", "spiritual", "mountain", "cultural", "wildlife"],
      default: "cultural",
    },
    difficulty: { type: String, enum: ["easy", "moderate", "challenging"], default: "easy" },
    bestFor: { type: String },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    included: [{ type: String }],
    excluded: [{ type: String }],
    itinerary: [itineraryItemSchema],
    highlights: [{ type: String }],
    reviews: [reviewSchema],
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

packageSchema.index({ destination: 1 });
packageSchema.index({ category: 1 });
packageSchema.index({ price: 1 });
packageSchema.index({ featured: -1 });

export default mongoose.models.Package || mongoose.model("Package", packageSchema);
