import mongoose from "mongoose";

/**
 * Connects to MongoDB using the URI + DB name from the environment.
 * Mongoose keeps a connection pool internally, so this only needs
 * to run once when the server boots.
 */
const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log(`MongoDB connected -> ${mongoose.connection.name}`);
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err.message);
    });

    const uri = `${process.env.MONGODB_URI}/${process.env.DB_NAME || "hotel-booking"}`;

    await mongoose.connect(uri);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
