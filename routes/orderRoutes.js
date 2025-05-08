const express = require("express");
const router3 = express.Router();
const {
  createOrder,
  getAllOrdersByUser,
  getSingleOrderByUser,
} = require("../controllers/orderController");

// Create order
router3.post("/add-order", createOrder);

// Get all orders for a specific user
router3.get("/user/:userId/orders", getAllOrdersByUser);

// Get single order for a user
router3.get("/user/:userId/order/:orderId", getSingleOrderByUser);

module.exports = router3;
