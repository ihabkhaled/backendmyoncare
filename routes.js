const express = require("express");
const router = express.Router();
const AuthToken = require("./middlewares/authMiddleware");

// controllers
const UserController = require("./controllers/UserController");
const AuthController = require("./controllers/AuthController");

router.get("/checkSession", [AuthToken], (req, res) => {
  return res.json({
    status: true,
    forceLogoutToken: false,
    message: "token valid",
  });
});

router.get("/users", [AuthToken], UserController.getAllUsers);

router.post(
  "/users/register",
  UserController.createUserValidations,
  UserController.SignUp
);

router.delete("/users", [AuthToken], UserController.Delete);

router.post("/users/restore", [AuthToken], UserController.RestoreUser);

router.patch("/users/edit", [AuthToken], UserController.editUser);

router.post("/login", AuthController.userLoginVlidations, AuthController.Login);

module.exports = router;
