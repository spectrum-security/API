const TemplateEmailController = require("../controllers/templateEmail.controller");
const checkAuth = require("../middleware/checkAuth");
const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", checkAuth, TemplateEmailController.getTemplateEmail);

router.get(
  "/last_7_days",
  adminMiddleware,
  TemplateEmailController.sentLast7Days
);

router.post(
  "/add",
  adminMiddleware,
  TemplateEmailController.createTemplateEmail
);

router.put(
  "/update/:id",
  adminMiddleware,
  TemplateEmailController.editTemplateEmail
);

router.delete(
  "/delete/:id",
  adminMiddleware,
  TemplateEmailController.deleteTemplateEmail
);

router.post("/set_default", TemplateEmailController.setDefaultTemplateEmail);

router.get(
  "/types",
  adminMiddleware,
  TemplateEmailController.getTemplateEmailTypes
);

router.post("/send", adminMiddleware, TemplateEmailController.sendEmailTo);

module.exports = router;
