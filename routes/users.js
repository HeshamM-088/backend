const express = require("express");
const router2 = express.Router();
const { getAllusers, getUser , addUser,editUser,deleteUser } = require("../controllers/users");

router2.route("/").get(getAllusers)
router2.route("/").post(addUser)
router2.route("/:id").get(getUser)
router2.route("/:id").patch(editUser)
router2.route("/:id").delete(deleteUser)
 

module.exports = router2;