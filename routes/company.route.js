const CompanyController = require("../controllers/company.controller");
const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");

router.get("/", checkAuth, CompanyController.getCompanies);

router.get("/:id", checkAuth, CompanyController.getCompanyById);

router.post("/", checkAuth, CompanyController.postCompany);

router.delete("/:id", checkAuth, CompanyController.deleteCompany);

router.put("/:id", checkAuth, CompanyController.updateCompany);

module.exports = router;
