const LogController = require("../controllers/log.controller");
const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");

router.get("/last-7-days", checkAuth, LogController.last7DaysLogs);

router.post("/add/:sensorId", checkAuth, LogController.addNewLog);

module.exports = router;
