const express = require("express");
const router2 = express.Router();
const { getAllusers, getUser, editUser, deleteUser } = require("../controllers/users");

// const multer = require("multer");
// const { userStorage } = require("../cloudinary/cloudinary"); // or ../config/cloudinary
// const upload = multer({ userStorage });
//  router2.post("/", upload.single("image"), addUser);
router2.route("/").get(getAllusers)
router2.route("/:id").get(getUser)
router2.route("/:id").patch(editUser)
router2.route("/:id").delete(deleteUser)
 

module.exports = router2;