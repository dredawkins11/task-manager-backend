require('express-async-errors');
const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const Token = require("../models/token");
const router = express.Router();

router.post("/", async (req, res) => {
  /* Login a user */

    const user = await User.findOne({ username: req.body.username.toLowerCase() });
    if (!user) return res.send({ failed: true, reason: "User not found" });

    if (await bcrypt.compare(req.body.password, user.password)) {
      const tokenPayload = { id: user.userId, username: user.username };
      const accessToken = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      let refreshTokenDatabase = new Token({ token: refreshToken });
      refreshTokenDatabase = await refreshTokenDatabase.save();

      res.send({ access: accessToken, refresh: refreshToken });

    } else return res.send({ failed: true, reason: "Invalid Password" });
});

router.post("/refresh", async (req, res) => {
  /* Request to refresh access token */

    let refreshToken = req.body.token;
    if (refreshToken == null) return res.status(401).send("No token");

    refreshToken = await Token.findOne({ token: refreshToken });
    if (!refreshToken) return res.status(403).send("Refresh token not found");
    jwt.verify(refreshToken.token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).send(err);
      const accessToken = generateAccessToken({ id: user.id, username: user.username.toLowerCase() });
      res.send({ accessToken });
    });
});

router.delete("/", async (req, res) => {
  /* Delete a refresh token from database */

  const token = await Token.findOneAndDelete({ token: req.body.token });
  res.send(token);
});

function generateAccessToken(tokenPayload) {
  return jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
}

function generateRefreshToken(tokenPayload) {
  return jwt.sign(tokenPayload, process.env.REFRESH_TOKEN_SECRET);
}

module.exports = router;
