const jwt = require("jsonwebtoken");
const { Unauthorized } = require("./requestError");

//  Generates a JWT token with the given payload and expiration time.

const generateToken = (payload, secret, expired) => {
  return jwt.sign(payload, secret, {
    expiresIn: expired,
  });
};

// Verifies the authenticity of a JWT token using the provided secret key.

const verifyUserToken = async (token, secret) => {
  try {
    const result = jwt.verify(token, secret);
    return result;
  } catch (err) {
    // Handle token verification error
    throw new Unauthorized("Authentication error, please check your token.");
  }
};

const generateRandomString = (length) => {
  let code = "";
  let schema = "0123456789";

  for (let i = 0; i < length; i++) {
    code += schema.charAt(Math.floor(Math.random() * schema.length));
  }

  return code;
};

module.exports = { generateToken, verifyUserToken, generateRandomString };
