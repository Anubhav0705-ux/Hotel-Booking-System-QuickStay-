import express from "express";
import { getMe, addRecentSearch } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", requireAuth, getMe);
router.post("/recent-searches", requireAuth, addRecentSearch);

export default router;
