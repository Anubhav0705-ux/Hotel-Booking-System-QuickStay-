import express from "express";
import {
  getHotels,
  getHotelCities,
  getHotelById,
  getMyHotel,
  createHotel,
} from "../controllers/hotelController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Public
router.get("/", getHotels);
router.get("/cities", getHotelCities);

// Authenticated (must come before "/:id" so "owner/me" isn't parsed as an id)
router.get("/owner/me", requireAuth, getMyHotel);
router.post("/", requireAuth, createHotel);

// Public
router.get("/:id", getHotelById);

export default router;
