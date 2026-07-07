import { verifyToken, createClerkClient } from "@clerk/backend";
import User from "../models/User.js";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

/**
 * Pulls the Clerk session token out of the Authorization header,
 * verifies it against Clerk, and attaches { userId } to req.auth.
 *
 * On the FIRST request we see from a given Clerk user, we also
 * upsert a matching document into our own `User` collection so the
 * rest of the app (bookings, ownership checks, dashboards) has a
 * local record to reference/populate without re-hitting Clerk's API
 * on every single request.
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const verified = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    const userId = verified.sub;
    req.auth = { userId };

    let localUser = await User.findById(userId);

    if (!localUser) {
      // Pull profile info from Clerk once, then cache it locally.
      const clerkUser = await clerkClient.users.getUser(userId);

      localUser = await User.create({
        _id: userId,
        username:
          `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
          clerkUser.username ||
          "Guest",
        email: clerkUser.emailAddresses?.[0]?.emailAddress || "",
        image: clerkUser.imageUrl || "",
        role: "user",
      });
    }

    req.user = localUser;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired session" });
  }
};

/**
 * Same as requireAuth, but never rejects the request if there's no
 * token — just leaves req.auth/req.user undefined. Useful for routes
 * that behave slightly differently for logged-in vs anonymous users
 * (not used everywhere yet, but handy to have).
 */
export const attachAuthIfPresent = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) return next();
  return requireAuth(req, res, next);
};

/**
 * Gate for hotel-owner-only routes. Must run after requireAuth.
 */
export const requireHotelOwner = (req, res, next) => {
  if (!req.user || req.user.role !== "hotelOwner") {
    return res
      .status(403)
      .json({ success: false, message: "Only hotel owners can perform this action" });
  }
  next();
};
