import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { asyncHandler } from "../middleware/errorHandler.js";

/**
 * GET /api/rooms
 * Supports the filters used on the AllRooms page:
 *   ?city=New York
 *   ?search=some text (matches hotel name/address/city)
 *   ?roomType=Double Bed&roomType=Single Bed   (repeatable)
 *   ?amenities=Free WiFi&amenities=Pool Access (repeatable, room must have ALL selected)
 *   ?minPrice=100&maxPrice=400
 *   ?sort=priceAsc | priceDesc | newest
 */
export const getRooms = asyncHandler(async (req, res) => {
  const { city, search, roomType, amenities, minPrice, maxPrice, sort } = req.query;

  // Rooms reference a hotel, and city/search filter on hotel fields,
  // so first resolve the matching hotel ids (if any hotel filter given).
  let hotelFilter = {};
  if (city) hotelFilter.city = new RegExp(`^${city}$`, "i");
  if (search) {
    const regex = new RegExp(search, "i");
    hotelFilter.$or = [{ name: regex }, { address: regex }, { city: regex }];
  }

  let hotelIds = null;
  if (Object.keys(hotelFilter).length > 0) {
    const hotels = await Hotel.find(hotelFilter).select("_id");
    hotelIds = hotels.map((h) => h._id);
  }

  const roomFilter = { isAvailable: true };
  if (hotelIds) roomFilter.hotel = { $in: hotelIds };

  if (roomType) {
    const types = Array.isArray(roomType) ? roomType : [roomType];
    roomFilter.roomType = { $in: types };
  }

  if (amenities) {
    const list = Array.isArray(amenities) ? amenities : [amenities];
    roomFilter.amenities = { $all: list };
  }

  if (minPrice || maxPrice) {
    roomFilter.pricePerNight = {};
    if (minPrice) roomFilter.pricePerNight.$gte = Number(minPrice);
    if (maxPrice) roomFilter.pricePerNight.$lte = Number(maxPrice);
  }

  let sortOption = { createdAt: -1 };
  if (sort === "priceAsc") sortOption = { pricePerNight: 1 };
  if (sort === "priceDesc") sortOption = { pricePerNight: -1 };

  const rooms = await Room.find(roomFilter)
    .populate({ path: "hotel", populate: { path: "owner", select: "username image" } })
    .sort(sortOption);

  res.json({ success: true, count: rooms.length, rooms });
});

/**
 * GET /api/rooms/:id
 */
export const getRoomById = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id).populate({
    path: "hotel",
    populate: { path: "owner", select: "username image" },
  });

  if (!room) {
    return res.status(404).json({ success: false, message: "Room not found" });
  }

  res.json({ success: true, room });
});

/**
 * GET /api/rooms/owner/mine
 * All rooms belonging to the logged-in owner's hotel (ListRoom page).
 */
export const getMyRooms = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findOne({ owner: req.user._id });
  if (!hotel) {
    return res.json({ success: true, rooms: [] });
  }

  const rooms = await Room.find({ hotel: hotel._id })
    .populate("hotel")
    .sort({ createdAt: -1 });

  res.json({ success: true, rooms });
});

/**
 * POST /api/rooms
 * Create a room under the logged-in owner's hotel (AddRoom page).
 * Expects multipart/form-data: text fields + up to 4 files under "images".
 * amenities can arrive as a JSON string (e.g. '["Free WiFi","Pool Access"]')
 * or as repeated `amenities` fields - both are normalized below.
 */
export const createRoom = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findOne({ owner: req.user._id });
  if (!hotel) {
    return res
      .status(400)
      .json({ success: false, message: "Register a hotel before adding rooms" });
  }

  const { roomType, pricePerNight, maxGuests, description } = req.body;

  if (!roomType || !pricePerNight) {
    return res
      .status(400)
      .json({ success: false, message: "roomType and pricePerNight are required" });
  }

  let amenities = req.body.amenities || [];
  if (typeof amenities === "string") {
    try {
      amenities = JSON.parse(amenities);
    } catch {
      amenities = [amenities];
    }
  }

  const uploadedImages = (req.files || []).map(
    (file) => `${req.protocol}://${req.get("host")}/uploads/rooms/${file.filename}`
  );

  const room = await Room.create({
    hotel: hotel._id,
    roomType,
    pricePerNight,
    amenities,
    images: uploadedImages,
    maxGuests: maxGuests || 2,
    description: description || "",
  });

  res.status(201).json({ success: true, room });
});

/**
 * PATCH /api/rooms/:id
 * Update a room — only the owning hotel's owner may edit it.
 */
export const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id).populate("hotel");
  if (!room) {
    return res.status(404).json({ success: false, message: "Room not found" });
  }

  if (room.hotel.owner !== req.user._id) {
    return res.status(403).json({ success: false, message: "Not authorized to edit this room" });
  }

  const allowedFields = [
    "roomType",
    "pricePerNight",
    "amenities",
    "images",
    "maxGuests",
    "description",
    "isAvailable",
  ];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) room[field] = req.body[field];
  });

  await room.save();
  res.json({ success: true, room });
});

/**
 * DELETE /api/rooms/:id
 */
export const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id).populate("hotel");
  if (!room) {
    return res.status(404).json({ success: false, message: "Room not found" });
  }

  if (room.hotel.owner !== req.user._id) {
    return res.status(403).json({ success: false, message: "Not authorized to delete this room" });
  }

  await room.deleteOne();
  res.json({ success: true, message: "Room deleted" });
});
