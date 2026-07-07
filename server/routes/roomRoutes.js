import express from "express";
import {
  getRooms,
  getRoomById,
  getMyRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController.js";
import { requireAuth, requireHotelOwner } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Public
router.get("/", getRooms);

// Owner-only (before "/:id")
router.get("/owner/mine", requireAuth, requireHotelOwner, getMyRooms);
// multipart/form-data: up to 4 files under the "images" field
router.post("/", requireAuth, requireHotelOwner, upload.array("images", 4), createRoom);

// Public
router.get("/:id", getRoomById);

// Owner-only
router.patch("/:id", requireAuth, requireHotelOwner, updateRoom);
router.delete("/:id", requireAuth, requireHotelOwner, deleteRoom);

export default router;
