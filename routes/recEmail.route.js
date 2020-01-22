const RecEmailController = require("../controllers/recEmail.controller");
const checkAuth = require("../middleware/checkAuth");
const adminMiddleware = require("../middleware/adminMiddleware");
const express = require("express");
const router = express.Router();

router.get("/", RecEmailController.getRecEmailConfig);

router.get("/inbox", RecEmailController.getInbox);

router.get("/last_7_days", RecEmailController.createdLast7Days);

router.post("/", RecEmailController.createRecEmailConfig);

router.delete("/", RecEmailController.deleteRecEmailConfig);

module.exports = router;
