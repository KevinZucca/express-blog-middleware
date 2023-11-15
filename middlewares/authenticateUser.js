const express = require("express");
const jwt = require("jsonwebtoken");
const jsonUsers = require("../users.json");

module.exports = function (req, res, next) {
  const bearerToken = req.header("Authorization");

  if (!bearerToken) {
    throw new Error("Token mancante");
  }

  const token = bearerToken.split(" ")[1];

  const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);

  if (!jwtPayload) {
    throw new Error("Il token non è valido");
  }
  req["user"] = jwtPayload;

  next();
};
