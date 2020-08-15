const express = require('express')
const jwt = require('jsonwebtoken')

function authenticateAccessToken(req, res, next) {
  if (req.url.includes("/api/login") || req.url.includes("/api/users")) return next();

  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send(err);
    req.user = user;
    next();
  });

}

module.exports = authenticateAccessToken;