const express = require("express");
const jwt = require("jsonwebtoken");
const jsonUsers = require("../users.json");

module.exports = function (req, res, next) {
  const bearerToken = req.header("Authorization");

  if (!bearerToken) {
    return res.status(401).send("Token mancante");
  }

  const token = bearerToken.split(" ")[1];

  const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);

  if (!jwtPayload) {
    return res.status(403).send("Il token non è valido");
  }
  req["user"] = jwtPayload;

  next();
};
