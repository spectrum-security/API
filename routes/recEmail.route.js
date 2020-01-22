const RecEmailController = require("../controllers/recEmail.controller");
const checkAuth = require("../middleware/checkAuth");
const adminMiddleware = require("../middleware/adminMiddleware");
const express = require("express");
const router = express.Router();

router.get("/", adminMiddleware, RecEmailController.getRecEmailConfig);

router.get("/inbox", adminMiddleware, RecEmailController.getInbox);

router.get(
  "/last_7_days",
  adminMiddleware,
  RecEmailController.createdLast7Days
);

router.post("/", adminMiddleware, RecEmailController.createRecEmailConfig);

router.delete("/", adminMiddleware, RecEmailController.deleteRecEmailConfig);

module.exports = router;
