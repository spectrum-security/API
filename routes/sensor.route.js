const SensorController = require("../controllers/sensor.controller");
const express = require("express");
const router = express.Router();

router.get("/", SensorController.getSensors);

router.get("/:id", SensorController.getSensorById);

router.get("/company_sensors/:id", SensorController.getCompanySensorsList);

router.post("/", SensorController.postSensor);

router.put("/:id", SensorController.updateSensor);

router.delete("/:id", SensorController.deleteSensor);

module.exports = router;
