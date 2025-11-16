const express = require('express');
const proxyFactory = require("../../services/proxyFactory");
const { productService } = require('../../config/services');
const { adminAuth } = require("../../middleware/adminAuth");

const router = express.Router();

// Admin product routes - require admin authentication
// Routes: POST /admin/products, PUT /admin/products/:id, DELETE /admin/products/:id
router.use("/", adminAuth, proxyFactory(productService, {"^/admin/products": "/products"}))

module.exports = router;

