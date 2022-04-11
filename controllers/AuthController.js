const User = require("../models/User");

const jwt = require("jsonwebtoken");
const { check } = require("express-validator");
const { nextValidatorFunction } = require("../utils/validateRequests");

const userLoginVlidations = [
  check("email").notEmpty().withMessage("Email cannot be empty!"),
  check("email").isEmail().withMessage("Email invalid format!"),
  check("password").notEmpty().withMessage("Password cannot be empty!"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password cannot be less than 6 characters!"),
  (req, res, next) => {
    nextValidatorFunction(req, res, next);
  },
];

module.exports = {
  async Login(req, res) {
    const loginObj = {
      email: req.body.email,
      password: req.body.password,
    };

    const user = await User.findOne({
      email: loginObj.email,
      is_deleted: false,
    });

    if (!user) {
      return res.json({
        status: false,
        message: "Authentication failed. Wrong email",
      });
    }

    const comparePasswordMatching = await user.comparePassword(
      loginObj.password
    );

    if (!comparePasswordMatching) {
      return res.json({
        status: false,
        message: "Authentication failed. Wrong password",
      });
    }

    if (user.is_active == 0) {
      return res.json({
        status: false,
        message: "User inactive",
      });
    }

    const tokenExpiryDays = "365d";
    const tokenPayload = { _id: user._id, email: user.email };
    const tokenExpireDate = new Date();
    tokenExpireDate.setDate(tokenExpireDate.getDate() + 365);

    token = jwt.sign({ user: tokenPayload }, "myoncare2022", {
      expiresIn: tokenExpiryDays,
    });

    return res.json({
      status: true,
      message: "Login done",
      user,
      token,
      tokenExpireDate,
    });
  },
  userLoginVlidations,
};
