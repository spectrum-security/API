const CompanyController = require("../controllers/company.controller")
const express = require("express")
const router = express.Router()


router.get("/", CompanyController.getCompany)

router.get("/:id", CompanyController.getCompanyById)

router.post("/", CompanyController.postCompany)

router.delete("/:id",CompanyController.deleteCompany)

router.put("/:id",CompanyController.updateCompany)



module.exports = router
