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

    if (addUser.cartItems.find((item) => item.productId == productId)) {
      addUser.cartItems = addUser.cartItems.map((item) => {
        if (item.productId == productId) {
          let priv = item.quantity; 
          return { productId, quantity: priv + quantity };
        } else {
          return item;
        }
      });
    } else {
      addUser.cartItems.push({
        productId,
        quantity,
      });
    }

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
    const { productId, userId, quantity } = req.body;
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

    const product = user.cartItems.find((item) => item.productId == productId);
    if (product.quantity > 1) {
      user.cartItems = user.cartItems.map((item) => {
        if (item.productId == productId) {
          let priv = item.quantity;
          return { productId, quantity: Math.max(0, priv - quantity) };
          
        } else {
          return item;
        }
      });
    }
    else {
      user.cartItems = user.cartItems.filter(
        (item) => !item.productId.equals(productId)
      );
    }

    user.cartItems = user.cartItems.filter(item => Number(item.quantity) > 0);
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

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const cartItems = [];

    for (const item of user.cartItems) {
      const product = await Product.findById(item.productId); 
      if (product) {
        cartItems.push({
          product, 
          quantity: item.quantity,
        });
      }
    }

    res.status(200).json({ cartItems });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addToCart, deleteFromCart, getCartItems };
