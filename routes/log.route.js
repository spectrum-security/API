const LogController = require("../controllers/log.controller");
const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");

router.get("/last_7_days", checkAuth, LogController.last7DaysLogs);

router.get("/", checkAuth, LogController.getLogs);

router.get("/company_sensors/:id", checkAuth, LogController.getByCompany);

router.get("/analytics", checkAuth, LogController.getForChart);

router.get("/:id", checkAuth, LogController.getLogsBySensorId);

// router.post("/add/:sensorId", LogController.addNewLog);

module.exports = router;
