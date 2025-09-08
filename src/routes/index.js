const express = require('express');
const router = express.Router();

const authRoutes = require('./app/authRoutes');
const profileRoutes = require('./app/profileRoutes');

router.use("/auth", authRoutes);
router.use("/profiles", profileRoutes);

module.exports = router;