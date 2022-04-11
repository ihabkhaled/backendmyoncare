const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  let token = req.headers.token;

  if (!token) {
    return res.json({
      status: false,
      forceLogoutToken: true,
      message: "No token provided.",
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, "myoncare2022");
  } catch (error) {
    return res.json({
      status: false,
      forceLogoutToken: true,
      message: "Failed to authenticate token.",
    });
  }

  let user = await User.findOne({
    _id: decoded.user._id,
    is_deleted: false,
  });

  if (!user) {
    return res.json({
      status: false,
      forceLogoutToken: true,
      message: "Failed to authenticate token.",
    });
  }

  return next();
};
