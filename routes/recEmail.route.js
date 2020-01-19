const RecEmailController = require("../controllers/recEmail.controller");
const checkAuth = require("../middleware/checkAuth");
const adminMiddleware = require("../middleware/adminMiddleware");
const express = require("express");
const router = express.Router();

router.get(
  "/",
  checkAuth,
  adminMiddleware,
  RecEmailController.getRecEmailConfig
);

router.get("/inbox", checkAuth, adminMiddleware, RecEmailController.getInbox);

router.get(
  "/last_7_days",
  checkAuth,
  adminMiddleware,
  RecEmailController.createdLast7Days
);

router.post(
  "/",
  checkAuth,
  adminMiddleware,
  RecEmailController.createRecEmailConfig
);

router.delete(
  "/",
  checkAuth,
  adminMiddleware,
  RecEmailController.deleteRecEmailConfig
);

module.exports = router;
