const Product = require("../models/product");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ products });
  } catch {
    res.status(500).json({ msg: err });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subcategory,
      stock,
      available,
      rating,
    } = req.body;

    const image = req.file?.path;
    if (!image) {
      return res.status(400).json({ msg: "Image is required" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      subcategory,
      image,
      stock,
      available,
      rating,
    });

    res.status(201).json({ product });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({ _id: id });
    if (!product) {
      return res.status(404).json({ msg: "Product is not found" });
    }
    res.status(200).json({ product });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ msg: "Product is not found" });
    }
    res.status(200).json({ product });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOneAndDelete({ _id: id });
    if (!product) {
      return res.status(404).json({ msg: "Product is not found" });
    }
    res.status(200).send("Task has been deleted");
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

module.exports = {
  getProducts,
  getSingleProduct,
  updateProduct,
  createProduct,
  deleteProduct,
};
