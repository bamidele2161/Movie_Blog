const express = require("express");
const router = express.Router();
const {
  UserRegistration,
  Login,
  LogoutUser,
  ForgotPassword,
  VerifyCode,
  ChangePassword,
} = require("../controller/auth");

router.get("/r", (req, res) => {
  return res.status(200).json({
    message: "testing route",
  });
});

router.post("/", UserRegistration);
router.post("/login", Login);
router.post("/forgot", ForgotPassword);
router.post("/verify", VerifyCode);
router.post("/reset", ChangePassword);
router.get("/logout", LogoutUser);

module.exports = router;
