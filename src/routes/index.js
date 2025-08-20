const express = require('express');
const router = express.Router();

const userRoutes = require('./app/userRoutes');
const profileRoutes = require('./app/profileRoutes');

router.use("/users", userRoutes);
router.use("/profiles", profileRoutes);

module.exports = router;