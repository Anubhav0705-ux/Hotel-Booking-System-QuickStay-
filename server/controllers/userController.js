import User from "../models/User.js";
import { asyncHandler } from "../middleware/errorHandler.js";

/**
 * GET /api/users/me
 * Returns the local profile for the logged-in user (role, recent
 * searches, etc). requireAuth already upserts the record, so by the
 * time this runs it's guaranteed to exist.
 */
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

/**
 * POST /api/users/recent-searches
 * Body: { city }
 * Adds a city to the user's recent-search history (capped at 3,
 * most-recent-first, no duplicates) — mirrors recentSearchedCities
 * from the original dummy user data.
 */
export const addRecentSearch = asyncHandler(async (req, res) => {
  const { city } = req.body;
  if (!city) {
    return res.status(400).json({ success: false, message: "city is required" });
  }

  const user = await User.findById(req.user._id);
  const updated = [city, ...user.recentSearchedCities.filter((c) => c !== city)].slice(0, 3);

  user.recentSearchedCities = updated;
  await user.save();

  res.json({ success: true, recentSearchedCities: user.recentSearchedCities });
});
