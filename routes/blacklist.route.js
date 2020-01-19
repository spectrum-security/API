const BlacklistController = require("../controllers/blacklist.controller");
const checkAuth = require("../middleware/checkAuth");
const adminMiddleware = require("../middleware/adminMiddleware");
const express = require("express");
const router = express.Router();

router.get("/", checkAuth, adminMiddleware, BlacklistController.getBlacklist);

router.post(
  "/",
  checkAuth,
  adminMiddleware,
  BlacklistController.createBlacklist
);

router.put("/", checkAuth, adminMiddleware, BlacklistController.editBlacklist);

router.delete(
  "/",
  checkAuth,
  adminMiddleware,
  BlacklistController.deleteBlacklist
);

module.exports = router;
