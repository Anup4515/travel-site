import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email?: string;
  password?: string;
  phone?: string;
  googleId?: string;
  authMethod: "email" | "phone" | "google";
  role: "user" | "admin";
  location?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    password: { type: String },
    phone: { type: String, unique: true, sparse: true, trim: true },
    googleId: { type: String, unique: true, sparse: true },
    authMethod: { type: String, enum: ["email", "phone", "google"], default: "email" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    location: { type: String, trim: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.models.User || mongoose.model<IUser>("User", userSchema);
