const TemplateEmailController = require("../controllers/templateEmail.controller");
const checkAuth = require("../middleware/checkAuth");
const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", TemplateEmailController.getTemplateEmail);

router.get("/last_7_days", TemplateEmailController.sentLast7Days);

router.post("/add", TemplateEmailController.createTemplateEmail);

router.put("/update/:id", TemplateEmailController.editTemplateEmail);

router.delete("/delete/:id", TemplateEmailController.deleteTemplateEmail);

router.post("/set_default", TemplateEmailController.setDefaultTemplateEmail);

router.get("/types", TemplateEmailController.getTemplateEmailTypes);

router.post("/send", TemplateEmailController.sendEmailTo);

module.exports = router;
