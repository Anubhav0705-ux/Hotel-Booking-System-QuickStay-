import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },
    roomType: {
      type: String,
      required: true,
      enum: ["Single Bed", "Double Bed", "Luxury Suite", "Family Suite"],
    },
    pricePerNight: { type: Number, required: true, min: 0 },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String], // URLs (seed data uses Unsplash, uploads would be file paths / cloud URLs)
      default: [],
    },
    maxGuests: { type: Number, default: 2, min: 1 },
    description: { type: String, default: "" },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Helpful compound index for the common filter combinations on /rooms
roomSchema.index({ pricePerNight: 1, roomType: 1 });

const Room = mongoose.models.Room || mongoose.model("Room", roomSchema);

export default Room;
