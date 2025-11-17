const express = require("express");
const router = express.Router();
const { userAuthToken } = require("../middleware/auth");
const { adminAuth } = require("../middleware/adminAuth");

const authRoutes = require("./app/authRoutes");
const profileRoutes = require("./app/profileRoutes");
const userRoutes = require("./app/userRoutes");
const libraryRoutes = require("./app/libraryRoutes");
const productRoutes = require("./app/productRoutes");
const reviewRoutes = require("./app/reviewRoutes");
const adminRoutes = require("./app/adminRoutes");

// Public routes
router.use("/auth", authRoutes);//for admin and user without token
// Note: Individual routes in adminRoutes should use adminAuth middleware if needed
router.use("/admin", adminRoutes);

// User authenticated routes
router.use("/profiles", userAuthToken, profileRoutes);
router.use("/users", userAuthToken, userRoutes);
router.use("/library", userAuthToken, libraryRoutes);
router.use("/products", productRoutes); // Public routes don't need auth
router.use("/reviews", reviewRoutes); // Some routes need auth, handled in service

module.exports = router;
