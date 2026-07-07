import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import { asyncHandler } from "../middleware/errorHandler.js";

/**
 * GET /api/hotels
 * List hotels. Supports optional ?city= and ?search= (matches name/address/city).
 */
export const getHotels = asyncHandler(async (req, res) => {
  const { city, search } = req.query;
  const filter = {};

  if (city) filter.city = new RegExp(`^${city}$`, "i");

  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [{ name: regex }, { address: regex }, { city: regex }];
  }

  const hotels = await Hotel.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: hotels.length, hotels });
});

/**
 * GET /api/hotels/cities
 * Distinct list of cities that have at least one hotel — used to
 * power the destination search dropdown instead of a hardcoded array.
 */
export const getHotelCities = asyncHandler(async (req, res) => {
  const cities = await Hotel.distinct("city");
  res.json({ success: true, cities });
});

/**
 * GET /api/hotels/:id
 * Single hotel + all of its rooms (so the frontend can render a
 * "hotel details" page listing every room type it offers).
 */
export const getHotelById = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id).populate("owner");
  if (!hotel) {
    return res.status(404).json({ success: false, message: "Hotel not found" });
  }

  const rooms = await Room.find({ hotel: hotel._id, isAvailable: true });
  res.json({ success: true, hotel, rooms });
});

/**
 * GET /api/hotels/owner/me
 * The hotel owned by the currently authenticated hotel owner (if any).
 * Used to decide whether to show the "Register your hotel" form.
 */
export const getMyHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findOne({ owner: req.user._id });
  res.json({ success: true, hotel: hotel || null });
});

/**
 * POST /api/hotels
 * Register a new hotel for the logged-in user, and promote that
 * user's role to "hotelOwner" so they can access the dashboard.
 */
export const createHotel = asyncHandler(async (req, res) => {
  const { name, address, contact, city } = req.body;

  if (!name || !address || !contact || !city) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const existing = await Hotel.findOne({ owner: req.user._id });
  if (existing) {
    return res
      .status(409)
      .json({ success: false, message: "You have already registered a hotel" });
  }

  const hotel = await Hotel.create({
    name,
    address,
    contact,
    city,
    owner: req.user._id,
  });

  await User.findByIdAndUpdate(req.user._id, { role: "hotelOwner" });

  res.status(201).json({ success: true, hotel });
});
