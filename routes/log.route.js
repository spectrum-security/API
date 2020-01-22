const LogController = require("../controllers/log.controller");
const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");

router.get("/last_7_days", LogController.last7DaysLogs);

router.get("/", LogController.getLogs);

router.get("/analytics", LogController.getForChart);

router.get("/:id", LogController.getLogsBySensorId);

// router.post("/add/:sensorId", LogController.addNewLog);

module.exports = router;
