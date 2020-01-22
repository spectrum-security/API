const BlacklistController = require("../controllers/blacklist.controller");
const checkAuth = require("../middleware/checkAuth");
const adminMiddleware = require("../middleware/adminMiddleware");
const express = require("express");
const router = express.Router();

router.get("/", adminMiddleware, BlacklistController.getBlacklist);

router.post("/", adminMiddleware, BlacklistController.createBlacklist);

router.put("/", adminMiddleware, BlacklistController.editBlacklist);

router.delete("/", adminMiddleware, BlacklistController.deleteBlacklist);

module.exports = router;
