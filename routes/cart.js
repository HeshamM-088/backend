const express = require("express");
const cartRouter = express.Router();

const { addToCart, deleteFromCart, getCartItems } = require("../controllers/cart");

cartRouter.post("/", addToCart);

cartRouter.delete("/", deleteFromCart);

cartRouter.get("/:uid", getCartItems);


module.exports = cartRouter;