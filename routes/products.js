const express = require("express");
const router = express.Router();
const {
  getProducts,
  getSingleProduct,
  updateProduct,
  createProduct,
  deleteProduct,
} = require("../controllers/products");

const multer = require("multer");
const { storage } = require("../cloudinary/cloudinary"); // or ../config/cloudinary
const upload = multer({ storage });

//get, post, patch, delete actions setup

//GET route to get all products
router.get("/", getProducts);

//POST route to create a new product
router.post("/", upload.single("image"), createProduct);

//GET product by id
router.get("/:id", getSingleProduct);

//PATCH route for updating a single product
router.patch("/:id", updateProduct);

//DELETE route for deleting a product by id
router.delete("/:id", deleteProduct);

module.exports = router;
