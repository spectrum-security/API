const TemplateEmailController = require("../controllers/templateEmail.controller");
const checkAuth = require("../middleware/checkAuth");
const express = require("express");
const router = express.Router();
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", checkAuth, TemplateEmailController.getTemplateEmail);

router.get(
  "/last_7_days",
  checkAuth,
  adminMiddleware,
  TemplateEmailController.sentLast7Days
);

router.post(
  "/add",
  checkAuth,
  adminMiddleware,
  TemplateEmailController.createTemplateEmail
);

router.put(
  "/update/:id",
  checkAuth,
  adminMiddleware,
  TemplateEmailController.editTemplateEmail
);

router.delete(
  "/delete/:id",
  checkAuth,
  adminMiddleware,
  TemplateEmailController.deleteTemplateEmail
);

router.post(
  "/set_default",
  checkAuth,
  TemplateEmailController.setDefaultTemplateEmail
);

router.get(
  "/types",
  checkAuth,
  adminMiddleware,
  TemplateEmailController.getTemplateEmailTypes
);

router.post(
  "/send",
  checkAuth,
  adminMiddleware,
  TemplateEmailController.sendEmailTo
);

module.exports = router;
