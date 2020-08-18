const mongoose = require("mongoose");
const express = require("express");
const uniqid = require("uniqid");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const router = express.Router();

router.post("/", async (req, res) => {
  /* Create a new user */

    const { validationError } = validate(req.body);
    if (validationError) return res.status(400).send(validationError.details[0].message);

    const existingUser = await User.findOne({ username: req.body.username.toLowerCase() });
    if (existingUser) return res.send(false);

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    let user = new User({
      username: req.body.username.toLowerCase(),
      email: req.body.email,
      userId: uniqid("user-"),
      password: hashedPassword,
    });

    user = await user.save();
    res.send(user);
});

router.get("/", async (req, res) => {
  /* Check whether a user with the specified name exists */
  const user = await User.findOne({ username: req.body.username });
  if (user) {
    res.send(false);
  }
  res.send(true);
});

module.exports = router;
