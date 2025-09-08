const express = require("express");
const router = express.Router();
const { userAuthToken } = require("../middleware/auth");

const authRoutes = require("./app/authRoutes");
const profileRoutes = require("./app/profileRoutes");
const userRoutes = require("./app/userRoutes");

router.use("/auth", authRoutes);
router.use("/profiles", userAuthToken, profileRoutes);
router.use("/users", userAuthToken, userRoutes);

module.exports = router;
