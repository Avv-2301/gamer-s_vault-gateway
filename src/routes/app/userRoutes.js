const express = require('express');
const proxyFactory = require('../../services/proxyFactory');
const { userService } = require('../../config/services');

const router = express.Router();

router.use("/", proxyFactory(userService, {"^/users":""}));

module.exports = router;
