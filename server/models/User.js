import mongoose from "mongoose";

/**
 * User documents are keyed by the Clerk user id (a string, not an ObjectId).
 * We don't manage passwords here at all — Clerk owns authentication.
 * This collection just mirrors the profile fields the app needs
 * (role, recent searches) and is created/updated the first time
 * we see a verified Clerk token for that user (see middleware/auth.js).
 */
const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Clerk userId, e.g. "user_2unqyL..."
    username: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, default: "" },
    role: {
      type: String,
      enum: ["user", "hotelOwner"],
      default: "user",
    },
    recentSearchedCities: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true, _id: false }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
