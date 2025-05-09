const express = require("express");
const wishlistRouter = express.Router();
const { getWishlistItems, addToWishlist, deleteFromWishlist } = require("../controllers/wishlist");

wishlistRouter.get("/", getWishlistItems);
wishlistRouter.post("/", addToWishlist);
wishlistRouter.delete("/", deleteFromWishlist);
module.exports = wishlistRouter;
