const express = require("express");
const cartRouter = express.Router();

const { addToCart, deleteFromCart, getCartItems, editCart } = require("../controllers/cart");

cartRouter.post("/", addToCart);

cartRouter.delete("/", deleteFromCart);

cartRouter.get("/:uid", getCartItems);
cartRouter.patch("/:userId",editCart)


module.exports = cartRouter;