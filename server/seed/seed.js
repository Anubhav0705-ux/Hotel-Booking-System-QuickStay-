import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";
import {
  ownerUsers,
  demoTravelers,
  hotelSeeds,
  buildRoomsForHotel,
} from "./seedData.js";

const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const run = async () => {
  await connectDB();

  console.log("Clearing existing collections...");
  await Promise.all([
    User.deleteMany({}),
    Hotel.deleteMany({}),
    Room.deleteMany({}),
    Booking.deleteMany({}),
  ]);

  console.log("Seeding users...");
  const allUsers = [...ownerUsers, ...demoTravelers];
  await User.insertMany(allUsers);

  console.log(`Seeding ${hotelSeeds.length} hotels + rooms...`);
  const insertedHotels = [];
  for (const seed of hotelSeeds) {
    const owner = ownerUsers[seed.ownerIdx];
    const hotel = await Hotel.create({
      name: seed.name,
      address: seed.address,
      contact: seed.contact,
      city: seed.city,
      owner: owner._id,
    });
    insertedHotels.push(hotel);

    const roomDocs = buildRoomsForHotel(slugify(seed.name)).map((r) => ({
      ...r,
      hotel: hotel._id,
    }));
    await Room.insertMany(roomDocs);
  }

  const totalRooms = await Room.countDocuments();
  console.log(`Created ${insertedHotels.length} hotels and ${totalRooms} rooms.`);

  // A few sample bookings for the demo traveler, so MyBookings /
  // the owner dashboard aren't empty on first run.
  console.log("Seeding sample bookings...");
  const sampleRooms = await Room.find().limit(3).populate("hotel");
  const traveler = demoTravelers[0];

  const bookingsToCreate = sampleRooms.map((room, i) => {
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + (i + 1) * 3);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 2);

    return {
      user: traveler._id,
      room: room._id,
      hotel: room.hotel._id,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalPrice: room.pricePerNight * 2,
      guests: 2,
      status: "pending",
      paymentMethod: i % 2 === 0 ? "Stripe" : "Pay At Hotel",
      isPaid: i % 2 === 0,
    };
  });

  await Booking.insertMany(bookingsToCreate);

  console.log("Seeding complete.");
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
