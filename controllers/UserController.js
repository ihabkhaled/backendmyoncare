const User = require("../models/User");

const mongoose = require("mongoose");
const async = require("async");
const jwt = require("jsonwebtoken");
const { check } = require("express-validator");
const { nextValidatorFunction } = require("../utils/validateRequests");

const createUserValidations = [
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

const deleteUserValidations = [
  (req, res, next) => {
    check("id").notEmpty().withMessage("Id cannot be empty!"),
      nextValidatorFunction(req, res, next);
  },
];

module.exports = {
  async SignUp(req, res) {
    const createUserObj = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
    };

    const userCounter = await User.count({
      email: req.body.email,
    });

    if (userCounter > 0) {
      return res.status(200).send({
        message: "this email used before",
        status: false,
      });
    }

    const user = new User(createUserObj);
    user.save((err, user) => {
      if (err) {
        res.json({ status: false, error: err });

        return;
      }

      return res.json({
        status: true,
        message: "User Added",
        user,
      });
    });
  },

  async editUser(req, res) {
    let _id = req.body._id;
    let updateUserObj = req.body;
    updateUserObj = Object.fromEntries(
      Object.entries(updateUserObj).filter(([_, v]) => v != "")
    );
    updateUserObj = Object.fromEntries(
      Object.entries(updateUserObj).filter(([_, v]) => v != null)
    );
    console.log(updateUserObj);
    delete updateUserObj._id;

    let userUpdate = await User.findOne({
      _id: _id,
    });

    Object.keys(updateUserObj).forEach(function (key) {
      userUpdate[key] = updateUserObj[key];
    });

    // console.log(updateUserObj);
    await userUpdate.save();

    return res.json({
      status: true,
      message: "User Updated",
      user: userUpdate,
    });
  },

  async getAllUsers(req, res) {
    const users = await User.find({
      is_deleted: 0,
      is_active: 1,
    });

    return res.json({
      status: true,
      message: "Users fetched",
      users: users,
    });
  },

  async Delete(req, res) {
    let id = req.body.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.json({
        status: false,
        message: "User not found",
      });
    }

    const user = await User.findByIdAndUpdate(
      {
        _id: id,
      },
      { is_deleted: 1 }
    );

    if (!user) {
      return res.send({
        status: false,
        message: "User not updated",
      });
    } else {
      return res.send({
        status: true,
        message: "User updated",
        user,
      });
    }
  },

  async RestoreUser(req, res) {
    let id = req.body.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.json({
        status: false,
        message: "User not found",
      });
    }

    const user = await User.findByIdAndUpdate(
      {
        _id: id,
      },
      { is_deleted: 0 }
    );

    if (!user) {
      return res.send({
        status: false,
        message: "User not updated",
      });
    } else {
      return res.send({
        status: true,
        message: "User updated",
        user,
      });
    }
  },

  deleteUserValidations,
  createUserValidations,
};
