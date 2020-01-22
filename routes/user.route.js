const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const checkAuth = require("../middleware/checkAuth");

router.get("/", controller.get);

router.get("/created/last_7_days", controller.createdLast7Days);

router.get("/analytics", controller.getForChart);

router.put("/:id", controller.put);
router.delete("/:id", controller.del);

module.exports = router;
