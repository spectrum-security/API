const SensorController = require("../controllers/sensor.controller");
const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");

router.get("/", checkAuth, SensorController.getSensors);

router.get("/:id", checkAuth, SensorController.getSensorById);

router.get(
  "/company_sensors/:id",
  checkAuth,
  SensorController.getCompanySensorsList
);

router.post("/", checkAuth, SensorController.postSensor);

router.post("/:id/active", checkAuth, SensorController.changeActive);

router.put("/:id", checkAuth, SensorController.updateSensor);

router.delete("/:id", checkAuth, SensorController.deleteSensor);

module.exports = router;
