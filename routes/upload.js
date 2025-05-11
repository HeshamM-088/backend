const express = require('express');
const multer = require('multer');
const { productStorage,userStorage } = require('../cloudinary'); // path to your config file

const upload = multer({ productStorage });
const userUpload = multer({ userStorage });

const router = express.Router();

const Product = require('../models/product');
const user = require("../models/users")

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const imageUrl = req.file.path; // This is the Cloudinary URL
    const newProduct = new Product({
      name: req.body.name,
      image: imageUrl, // Save image URL in MongoDB
    });

    await newProduct.save();
    res.status(200).json({ message: 'Uploaded!', product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = uploadRouter;
