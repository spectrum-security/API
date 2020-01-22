//INCOMPLETE
const RequestController = require("../controllers/request.controller");
const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");

router.get("/", checkAuth, RequestController.getRequest);

router.post("/:companyId", checkAuth, RequestController.postRequest);

router.put("/:id", checkAuth, RequestController.putRequest);

router.delete("/:id", checkAuth, RequestController.delRequest);

module.exports = router;
