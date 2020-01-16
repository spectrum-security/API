const TemplateEmailController = require("../controllers/templateEmail.controller");
const checkAuth = require("../middleware/checkAuth");
const express = require("express");
const router = express.Router();

router.get("/", checkAuth, TemplateEmailController.getTemplateEmail);

router.post("/add", checkAuth, TemplateEmailController.createTemplateEmail);

router.put("/update/:id", checkAuth, TemplateEmailController.editTemplateEmail);

router.delete(
  "/delete/:id",
  checkAuth,
  TemplateEmailController.deleteTemplateEmail
);

router.post(
  "/set_default",
  checkAuth,
  TemplateEmailController.setDefaultTemplateEmail
);

router.get("/types", checkAuth, TemplateEmailController.getTemplateEmailTypes);

router.post("/send", TemplateEmailController.sendEmailTo);

module.exports = router;
