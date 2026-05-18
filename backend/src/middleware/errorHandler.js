const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((error) => error.message);

    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid job request ID",
    });
  }

  res.status(500).json({
    success: false,
    message: "Server error",
  });
};

module.exports = errorHandler;