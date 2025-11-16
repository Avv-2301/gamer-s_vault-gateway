const express = require('express');
const proxyFactory = require("../../services/proxyFactory");
const { libraryService } = require('../../config/services');

const router = express.Router();

router.use("/", proxyFactory(libraryService, {"^/library":""}))

module.exports = router;

