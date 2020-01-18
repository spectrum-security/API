const express = require("express");
const router = express.Router();

const upload = require("../config/multer.config");

const FileController = require("../controllers/file.controller");

// no controller just to make ity more simple
router.post(
  "/upload/avatar",
  upload.single("file"),
  FileController.uploadAvatar
);

module.exports = router;
