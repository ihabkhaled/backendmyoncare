const { validationResult } = require("express-validator");

const nextValidatorFunction = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ status: false, errors: errors.array() });
  next();
};

module.exports = { nextValidatorFunction };
