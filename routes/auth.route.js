const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/auth.controller");
const checkAuth = require("../middleware/checkAuth");
const authValidation = require("../middleware/validations/auth.validation");

/* GET home page. */
router.post(
  "/login",
  authValidation.loginValidationRules(),
  authValidation.validate,
  AuthController.login
);

/* GET home page. */
router.post(
  "/admin_login",
  authValidation.loginValidationRules(),
  authValidation.validate,
  AuthController.adminLogin
);

router.post(
  "/sign-up",
  authValidation.signUpValidationRules(),
  authValidation.validate,
  AuthController.signUp
);

router.get(
  "/me",
  authValidation.jwtValidationRules(),
  checkAuth,
  AuthController.getMe
);

module.exports = router;
