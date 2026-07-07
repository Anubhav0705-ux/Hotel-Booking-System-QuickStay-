import express from "express";
import {
  createBooking,
  getUserBookings,
  getHotelBookings,
  markBookingPaid,
} from "../controllers/bookingController.js";
import { requireAuth, requireHotelOwner } from "../middleware/auth.js";

const router = express.Router();

router.post("/", requireAuth, createBooking);
router.get("/user", requireAuth, getUserBookings);
router.get("/hotel", requireAuth, requireHotelOwner, getHotelBookings);
router.patch("/:id/pay", requireAuth, markBookingPaid);

export default router;
