const express = require("express");
const router = express.Router();
const mediaController = require("../controller/media.controller");

router.post("/", mediaController.post);

module.exports = router;
