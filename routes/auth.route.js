const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/auth.controller");
const checkAuth = require("../middleware/checkAuth");

/* GET home page. */
router.post("/login", AuthController.login);

router.post("/sign-up", AuthController.signUp);

router.get("/me", checkAuth, AuthController.getMe);

module.exports = router;
