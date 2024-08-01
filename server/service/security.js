const { dbPool } = require("../config/dbConnection");
const { authenticator } = require("otplib");
const qrcode = require("qrcode");

const { BadRequest, NotFound } = require("../util/requestError");
const {
  updateUserResetQRCodeByIdQuery,
  updateUserCodeByIdQuery,
  checkUserByIdQuery,
} = require("../query/auth");

const getQR = async (userId) => {
  try {
    const secret = authenticator.generateSecret();
    const uri = authenticator.keyuri(userId, "MOVIE BLOG", secret);
    const image = await qrcode.toDataURL(uri);

    const [updateUser] = await dbPool.query(updateUserResetQRCodeByIdQuery, [
      secret,
      userId,
    ]);

    if (!updateUser) {
      throw new BadRequest("Error occured while updating user");
    }

    return {
      message: "QR generated successfully",
      image: image,
      statusCode: 200,
    };
  } catch (error) {
    throw error;
  }
};

const verifyQR = async (userId, code) => {
  try {
    const [findUser] = await dbPool.query(checkUserByIdQuery, [userId]);

    if (findUser.length !== 1) {
      throw new NotFound("User not found!.");
    }
 
    const verifyCode = authenticator.check(code, findUser[0].qrcode);
  
    if (!verifyCode) {
      throw new BadRequest("Invalid code");
    }

    return {
      message: "verified successfully",
      statusCode: 200,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getQR,
  verifyQR,
};
