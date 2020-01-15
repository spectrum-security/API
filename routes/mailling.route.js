const TemplateEmailController = require("../controllers/templateEmail.controller");
const checkAuth = require("../middleware/checkAuth");
const express = require("express");
const router = express.Router();

router.get("/", checkAuth, TemplateEmailController.getTemplateEmail);

router.post("/", checkAuth, TemplateEmailController.createTemplateEmail);

router.put("/", checkAuth, TemplateEmailController.editTemplateEmail);

router.delete("/", checkAuth, TemplateEmailController.deleteTemplateEmail);

router.post(
  "/set_default",
  checkAuth,
  TemplateEmailController.setDefaultTemplateEmail
);

router.get("/types", checkAuth, TemplateEmailController.getTemplateEmailTypes);

router.post("/send", checkAuth, TemplateEmailController.sendEmailTo);

module.exports = router;
