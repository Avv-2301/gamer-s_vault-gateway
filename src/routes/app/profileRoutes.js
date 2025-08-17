const express = require('express');
const proxyFactory  = require("../../services/proxyFactory");
const { profileService } = require('../../config/services');

const router = express.Router();

router.use("/", proxyFactory(profileService, {"^/profiles":""}))

module.exports = router;