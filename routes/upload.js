const express = require('express');
const multer = require('multer');
const { storage } = require('../cloudinary'); // path to your config file

const upload = multer({ storage });

const uploadRouter = express.Router();

// Assuming you have a Mongoose model like "Product"
const Product = require('../models/product');

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
