//INCOMPLETE

const RequestController = require("../controllers/request.controller");
const express = require("express");
const router = express.Router();

router.get("/", RequestController.getRequest);

router.post("/:companyId", RequestController.postRequest);

router.put("/:id", RequestController.putRequest);

router.delete("/:id", RequestController.delRequest);

module.exports = router;
