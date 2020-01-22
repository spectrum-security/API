const CompanyController = require("../controllers/company.controller");
const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const passwordGenerator = require("../utils/passwordGenerator");

router.get("/", CompanyController.getCompanies);

router.get("/:id", CompanyController.getCompanyById);

router.get("/:id/users", CompanyController.getCompanyUsers);

router.post(
  "/",
  passwordGenerator.generatePassword,
  CompanyController.postCompany
);

router.delete("/:id", CompanyController.deleteCompany);

router.put("/:id", CompanyController.updateCompany);

module.exports = router;
