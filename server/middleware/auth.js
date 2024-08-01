const jwt = require("jsonwebtoken");
const { Forbidden, Unauthorized } = require("../util/requestError");

// Middleware function to authorize incoming requests
const authorizer = (req, res, next) => {
  const token = req.cookies.accessToken; // Access the token from HTTP-only cookies

  // Check if token is missing
  if (!token) {
    throw new Unauthorized("Authorization token is missing");
  }

  // Verify the token
  jwt.verify(token, process.env.TOKEN_USER_SECRET, (err, user) => {
    if (err) {
      // Handle token verification error
      throw new Forbidden("Forbidden token");
    }

    // Attach user data to request object
    req.user = user;
    next(); // Proceed to next middleware
  });
};

module.exports = authorizer;
