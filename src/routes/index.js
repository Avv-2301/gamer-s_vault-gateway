const express = require('express');
const router = express.Router();

const authRoutes = require('./app/authRoutes');
const profileRoutes = require('./app/profileRoutes');
const userRoutes = require("./app/userRoutes");

router.use("/auth", authRoutes);
router.use("/profiles", profileRoutes);
router.use("/user", userRoutes);

module.exports = router;