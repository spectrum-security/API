const RecEmailConfigController = require("../controllers/recEmail.controller");
const checkAuth = require("../middleware/checkAuth");
const express = require("express");
const router = express.Router();

router.get("/", RecEmailConfigController.getRecEmailConfig);

router.post("/", RecEmailConfigController.createRecEmailConfig);

router.delete("/", RecEmailConfigController.deleteRecEmailConfig);

module.exports = router;
