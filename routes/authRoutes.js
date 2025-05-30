const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

const multer = require("multer");
const { userStorage } = require("../cloudinary/cloudinary");
const upload = multer({  userStorage });

router.post("/signup", upload.single("image"), authController.signup);
router.post("/login", authController.login);

module.exports = router;
