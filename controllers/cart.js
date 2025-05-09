const mongoose = require("mongoose");
const User = require("../models/users");
const Product = require("../models/product");

const addToCart = async (req, res) => {
  try {
    const { productId, quantity, userId } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Invalid product ID or user ID" });
    }

    if (!quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ message: "Quantity must be a positive number" });
    }

    const addUser = await User.findById(userId);
    if (!addUser) {
      return res.status(404).json({ message: "User not found" });
    }

    addUser.cartItems.push({
      productId,
      quantity,
    });

    await addUser.save();

    res.status(200).json({
      message: "Product added to cart successfully",
      cartItems: addUser.cartItems,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteFromCart = async (req, res) => {
  try {
    const { productId, userId } = req.body;
    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Invalid product ID or user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const initialLength = user.cartItems.length;

    user.cartItems = user.cartItems.filter(
      (item) => !item.productId.equals(productId)
    );

    if (user.cartItems.length === initialLength) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    await user.save();

    res.status(200).json({
      message: "Product removed from cart",
      cartItems: user.cartItems,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCartItems = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId).populate("cartItems.productId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItems = user.cartItems.map((item) => ({
      product: item.productId, // full product document
      quantity: item.quantity,
    }));

    res.status(200).json({ cartItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addToCart, deleteFromCart, getCartItems };
