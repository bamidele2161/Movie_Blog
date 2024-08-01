exports.ErrorHandler = (err, req, res, next) => {
  const errStatus = err?.statusCode || 500;
  const errMessage = errStatus === 500 ? "Error occured" : err?.message;

  res.status(errStatus).json({
    error: errMessage,
  });
};
