const {
  createAccount,
  userLogin,
  forgotPassword,
  verifyCode,
  changePassword,
} = require("../service/auth");
const { validateInput } = require("../util");
const { valueHasher } = require("../util/hash");
const { BadRequest } = require("../util/requestError");

exports.UserRegistration = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    if (!validateInput(first_name, "name")) {
      throw new BadRequest("Invalid first name provided.");
    }
    if (!validateInput(last_name, "name")) {
      throw new BadRequest("Invalid last name provided.");
    }
    if (!validateInput(email, "email")) {
      throw new BadRequest("Invalid email provided.");
    }
    if (!validateInput(first_name, "length", 3, 30)) {
      throw new BadRequest(
        "Your first name must be between 3 and 30 characters."
      );
    }
    if (!validateInput(last_name, "length", 3, 30)) {
      throw new BadRequest(
        "Your last name must be between 3 and 30 characters."
      );
    }
    if (!validateInput(password, "length", 6, 30)) {
      throw new BadRequest("Your password must be at least 6 characters.");
    }

    const cryptedPassword = await valueHasher(password, 12);

    const values = [first_name, last_name, email, cryptedPassword];
    const createUser = await createAccount(values);

    return res.status(createUser.statusCode).json({
      message: createUser.message,
      data: createUser.data,
      statusCode: createUser.statusCode,
    });
  } catch (error) {
    next(error);
  }
};

exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const payload = { email: email, password: password };
    const login = await userLogin(payload);

    res.cookie("accessToken", login.token, {
      httpOnly: true,
      secure: false, // Set to true if served over HTTPS
      maxAge: 3600000, // 1 hour
    });

    return res.status(login.statusCode).json({
      message: login.message,
      data: login.data,
      statusCode: login.statusCode,
      expiresIn: login.expiresIn,
    });
  } catch (error) {
    next(error);
  }
};

// forgot password service
exports.ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const forgot = await forgotPassword(email);

    return res.status(forgot.statusCode).json({
      message: forgot.message,
      statusCode: forgot.statusCode,
    });
  } catch (error) {
    throw error;
  }
};

// change password service
exports.VerifyCode = async (req, res) => {
  try {
    const { resetcode, email } = req.body;

    const forgot = await verifyCode(resetcode, email);

    return res.status(forgot.statusCode).json({
      message: forgot.message,
      statusCode: forgot.statusCode,
    });
  } catch (error) {
    throw error;
  }
};

// change password service
exports.ChangePassword = async (req, res) => {
  try {
    const { password, email } = req.body;

    const forgot = await changePassword(password, email);

    return res.status(forgot.statusCode).json({
      message: forgot.message,
      statusCode: forgot.statusCode,
    });
  } catch (error) {
    throw error;
  }
};

exports.LogoutUser = (req, res) => {
  try {
    //clear the cookie
    res.clearCookie("accessToken");

    // Send a response message along with the status code
    res.status(200).json({ message: "Logout successful", statusCode: 200 });
  } catch (error) {}
};
