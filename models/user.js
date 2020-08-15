const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    maxlength: 32,
    required: true,
  },
  userId: String,
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Offline",
  },
});
const User = mongoose.model("Users", userSchema);

function validate(user) {
  let schema = Joi.object({
    username: Joi.string(),
    password: Joi.string(),
  });

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validate;
