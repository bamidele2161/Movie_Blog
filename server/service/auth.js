const { dbPool } = require("../config/dbConnection");
const {
  createUserQuery,
  checkUserByEmailQuery,
  checkUserByIdQuery,
  updateUserResetQRCodeByIdQuery,
  checkUserByResetCodeQuery,
  updateUserCodeByIdQuery,
  updateUserPasswordQuery,
  updateUserResetCodeByIdQuery,
} = require("../query/auth");
const { matchChecker, valueHasher } = require("../util/hash");
const { BadRequest, NotFound } = require("../util/requestError");
const { sendEmail } = require("../util/sendEmail");
const { generateToken, generateRandomString } = require("../util/token");

const createAccount = async (values) => {
  try {
    const [results] = await dbPool.query(checkUserByEmailQuery, [values[2]]);

    if (results.length === 1) {
      throw new BadRequest("Email already exists");
    }

    const [createUser] = await dbPool.query(createUserQuery, values);

    if (!createUser) {
      throw new BadRequest("Error occured while creating user");
    }
    const [rows] = await dbPool.query(checkUserByIdQuery, createUser.insertId);

    if (rows.length !== 1) {
      throw new NotFound("Error occured while fetching user");
    }
    //send user email
    const subject = "Account Created Successfully.";
    const payload = {
      name: rows[0].first_name,
    };

    sendEmail(payload, rows[0].email, subject, "../view/registration.ejs");

    return {
      message: "Account created successfully",
      data: {
        id: rows[0].id,
        first_name: rows[0].first_name,
        last_name: rows[0].last_name,
        email: rows[0].email,
        created_at: rows[0].created_at,
        updated_at: rows[0].updated_at,
      },
      statusCode: 200,
    };
  } catch (error) {
    throw error;
  }
};

const userLogin = async (payload) => {
  try {
    const [checkUserExistence] = await dbPool.query(checkUserByEmailQuery, [
      payload.email,
    ]);

    if (checkUserExistence.length !== 1) {
      throw new NotFound("User does not exist!");
    }

    let checkPassword = await matchChecker(
      payload.password,
      checkUserExistence[0].password
    );

    if (!checkPassword) {
      throw new BadRequest("Invalid credentials!");
    }

    const userSecret = process.env.TOKEN_USER_SECRET;
    const token = generateToken(
      { id: checkUserExistence[0].id },
      userSecret,
      "1h"
    );
    //Get the current date timestamp
    const currentDate = Date.now();

    //add 1hour in milliseconds
    const oneHourLater = new Date(currentDate + 3600000);
    const response = {
      message: "User login successfully",
      data: {
        id: checkUserExistence[0].id,
        first_name: checkUserExistence[0].first_name,
        last_name: checkUserExistence[0].last_name,
        email: checkUserExistence[0].email,
      },
      token: token,
      expiresIn: oneHourLater,
      statusCode: 200,
    };

    return response;
  } catch (error) {
    throw error;
  }
};

// forgot password service
const forgotPassword = async (email) => {
  try {
    const [checkUserExistence] = await dbPool.query(checkUserByEmailQuery, [
      email,
    ]);

    if (checkUserExistence.length !== 1) {
      throw new NotFound("User does not exist!");
    }
    const resetCode = generateRandomString(6);

    const [updateUser] = await dbPool.query(updateUserResetCodeByIdQuery, [
      resetCode,
      checkUserExistence[0].id,
    ]);

    if (!updateUser) {
      return res.status(400).json({
        message: "Error occured while updating user",
      });
    }

    //send user email
    const subject = "Reset Password.";
    const payload = {
      name: checkUserExistence[0].first_name,
      otp: resetCode,
    };

    sendEmail(payload, email, subject, "../view/otp.ejs");

    return (response = {
      message: "Email reset code has been sent to your email",
      statusCode: 200,
    });
  } catch (error) {
    throw error;
  }
};

// change password service
const verifyCode = async (resetcode, email) => {
  try {
    const [checkUserExistence] = await dbPool.query(checkUserByEmailQuery, [
      email,
    ]);

    if (checkUserExistence.length !== 1) {
      throw new NotFound("User does not exist!");
    }

    const [checkCodeExistence] = await dbPool.query(checkUserByResetCodeQuery, [
      resetcode,
      email,
    ]);

    if (checkCodeExistence.length !== 1) {
      throw new NotFound("Invalid reset code!");
    }

    return {
      message: "Password reset code verified successfully",
      statusCode: 200,
    };
  } catch (error) {
    throw error;
  }
};

// change password service
const changePassword = async (password, email) => {
  try {
    const [checkUserExistence] = await dbPool.query(checkUserByEmailQuery, [
      email,
    ]);

    if (checkUserExistence.length !== 1) {
      throw new NotFound("User does not exist!");
    }

    const cryptedPassword = await valueHasher(password, 12);
    const [updateUser] = await dbPool.query(updateUserPasswordQuery, [
      cryptedPassword,
      checkUserExistence[0].id,
    ]);
    if (updateUser.affectedRows !== 1) {
      throw new NotFound("Error occurred while updating user");
    }

    const response = {
      message: "Password reset successfully",
      statusCode: 200,
    };

    return response;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createAccount,
  userLogin,
  forgotPassword,
  changePassword,
  verifyCode,
};
