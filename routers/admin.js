const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const authenticateMiddleware = require("../middlewares/authenticateUser");

router.use(authenticateMiddleware);

router.get("/", adminController.index);

module.exports = router;
