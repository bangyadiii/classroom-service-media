const express = require("express");
const router = express.Router();
const mediaController = require("../controller/media.controller");

router.get("/", mediaController.findAll);
router.post("/", mediaController.post);
router.delete("/:id", mediaController.destroy);

module.exports = router;
