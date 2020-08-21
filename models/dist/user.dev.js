"use strict";

var mongoose = require("mongoose");

var Joi = require("joi");

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    maxlength: 32,
    required: true
  },
  userId: String,
  password: {
    type: String,
    required: true
  }
});
var User = mongoose.model("Users", userSchema);

function validate(user) {
  var schema = Joi.object({
    username: Joi.string(),
    password: Joi.string()
  });
  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validate;