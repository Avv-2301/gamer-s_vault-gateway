const express = require('express');
const proxyFactory = require("../../services/proxyFactory");
const { adminService } = require('../../config/services');
const { adminAuth } = require('../../middleware/adminAuth');

const router = express.Router();

// Login route - public, no auth required
router.post("/login", proxyFactory(adminService, {"^/admin":""}));

// All other admin routes require authentication
router.use("/", adminAuth, proxyFactory(adminService, {"^/admin":""}))

module.exports = router;