const express = require('express');
const proxyFactory = require("../../services/proxyFactory");
const { productService } = require('../../config/services');

const router = express.Router();

router.use("/", proxyFactory(productService, {"^/reviews":"/reviews"}))

module.exports = router;

