const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const checkAuth = require("../middleware/checkAuth");

router.get("/", checkAuth, controller.get);

router.get("/created/last_7_days", checkAuth, controller.createdLast7Days);

router.get("/analytics", checkAuth, controller.getForChart);

router.put("/:id", checkAuth, controller.put);
router.delete("/:id", checkAuth, controller.del);

module.exports = router;
