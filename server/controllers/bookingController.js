import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { asyncHandler } from "../middleware/errorHandler.js";

/**
 * POST /api/bookings
 * Create a booking for the logged-in user. Price is recalculated
 * server-side from the room + number of nights so the client can't
 * spoof totalPrice.
 */
export const createBooking = asyncHandler(async (req, res) => {
  const { roomId, checkInDate, checkOutDate, guests, paymentMethod } = req.body;

  if (!roomId || !checkInDate || !checkOutDate || !guests) {
    return res.status(400).json({
      success: false,
      message: "roomId, checkInDate, checkOutDate and guests are required",
    });
  }

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (checkOut <= checkIn) {
    return res
      .status(400)
      .json({ success: false, message: "Check-out date must be after check-in date" });
  }

  const room = await Room.findById(roomId).populate("hotel");
  if (!room || !room.isAvailable) {
    return res.status(404).json({ success: false, message: "Room not found or unavailable" });
  }

  // Prevent double-booking: reject if an overlapping, non-cancelled
  // booking already exists for this room.
  const overlap = await Booking.findOne({
    room: room._id,
    status: { $ne: "cancelled" },
    checkInDate: { $lt: checkOut },
    checkOutDate: { $gt: checkIn },
  });

  if (overlap) {
    return res
      .status(409)
      .json({ success: false, message: "Room is already booked for those dates" });
  }

  const nights = Math.max(1, Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24)));
  const totalPrice = nights * room.pricePerNight;

  const booking = await Booking.create({
    user: req.user._id,
    room: room._id,
    hotel: room.hotel._id,
    checkInDate: checkIn,
    checkOutDate: checkOut,
    guests,
    totalPrice,
    paymentMethod: paymentMethod === "Stripe" ? "Stripe" : "Pay At Hotel",
    isPaid: false,
  });

  res.status(201).json({ success: true, booking });
});

/**
 * GET /api/bookings/user
 * All bookings made by the logged-in user (MyBookings page).
 */
export const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("hotel")
    .populate("room")
    .sort({ createdAt: -1 });

  res.json({ success: true, bookings });
});

/**
 * GET /api/bookings/hotel
 * All bookings made against the logged-in owner's hotel, plus
 * aggregate stats for the dashboard (totalBookings, totalRevenue).
 */
export const getHotelBookings = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findOne({ owner: req.user._id });
  if (!hotel) {
    return res.json({
      success: true,
      dashboardData: { totalBookings: 0, totalRevenue: 0, bookings: [] },
    });
  }

  const bookings = await Booking.find({ hotel: hotel._id })
    .populate("room")
    .populate("user", "username email image")
    .sort({ createdAt: -1 });

  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

  res.json({
    success: true,
    dashboardData: {
      totalBookings: bookings.length,
      totalRevenue,
      bookings,
    },
  });
});

/**
 * PATCH /api/bookings/:id/pay
 * Marks a booking as paid. In a real Stripe integration this would
 * instead be driven by a webhook; this endpoint keeps the "Pay Now"
 * button in MyBookings functional for the Pay-At-Hotel / demo flow.
 */
export const markBookingPaid = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
  if (!booking) {
    return res.status(404).json({ success: false, message: "Booking not found" });
  }

  booking.isPaid = true;
  booking.status = "confirmed";
  await booking.save();

  res.json({ success: true, booking });
});
