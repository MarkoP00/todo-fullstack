// Error handler middleware
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;

  return res.status(status).json({
    message: err.message || "Internal Server Error",
    data: err.data || null,
  });
};

export default errorHandler;
