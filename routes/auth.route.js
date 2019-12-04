const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/auth.controller");

/* GET home page. */
router.get("/login", AuthController.login);

module.exports = router;
