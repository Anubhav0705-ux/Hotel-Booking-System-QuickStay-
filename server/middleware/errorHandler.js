/**
 * Catch-all error handler. Route handlers use try/catch and call
 * next(error), or throw inside an asyncHandler-wrapped function —
 * either way it ends up here with a consistent JSON shape.
 */
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err.message);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid id format" });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({ success: false, message: messages.join(", ") });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};

/**
 * Wraps an async route handler so rejected promises get forwarded
 * to the error handler instead of crashing the process.
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
