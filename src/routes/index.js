const express = require('express');
const router = express.Router();

const userRoutes = require('./app/userRoutes');
const profileRoutes = require('./app/profileRoutes');

router.use("/users", userRoutes);
router.use("/profile", profileRoutes);

module.exports = router;