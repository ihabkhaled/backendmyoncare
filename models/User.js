const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"),
  SALT_WORK_FACTOR = 10;

const { Schema } = mongoose;

const UserSchema = new Schema({
  first_name: { type: String, required: false, default: "New" },
  last_name: { type: String, required: false, default: "User" },
  email: {
    type: String,
    index: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  createdAt: { type: Date, default: Date.now },
});

// hash password
UserSchema.pre("save", function (next) {
  const user = this;

  //only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) {
    return next();
  }

  //generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) {
      return next(err);
    }

    //hash the password using our new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }

      //override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.index({ email: 1, is_deleted: 1, is_active: 1 });

module.exports = mongoose.model("User", UserSchema);
