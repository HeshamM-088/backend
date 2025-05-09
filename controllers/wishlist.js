const mongoose = require("mongoose");
const User = require("../models/users");
const Product = require("../models/product");
const { deleteFromCart } = require("./cart");

const getWishlistItems = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const wishlistItems = await Product.find({ _id: { $in: user.wishlist } });

    res.status(200).json({ wishlist: wishlistItems });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (
      !mongoose.Types.ObjectId.isValid(productId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Invalid product ID or user ID" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    if (!user.wishlist.find((id) => id.equals(productId))) {
      user.wishlist.push(productId);
    }
    await user.save();
    res.status(200).json({ message: "Item is added", wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteFromWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        if (
          !mongoose.Types.ObjectId.isValid(productId) ||
          !mongoose.Types.ObjectId.isValid(userId)
        ) {
          return res
            .status(400)
            .json({ message: "Invalid product ID or user ID" });
        }
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User does not exist" });
        }
        
        if (user.wishlist.find((id) => id.equals(productId))) {
          user.wishlist = user.wishlist.filter(id => !id.equals(productId));
        }
        await user.save();
        res.status(200).json({ message: "Item is added", wishlist: user.wishlist });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getWishlistItems, addToWishlist, deleteFromWishlist };
