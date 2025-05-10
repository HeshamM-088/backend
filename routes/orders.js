const express = require("express");
const router3 = express.Router();
const {
  createOrder,
  getAllOrdersByUser,
  getSingleOrderByUser,
  cancelOrder,
} = require("../controllers/orders");

// Create order
router3.post("/create", createOrder);

// Get all orders for a specific user
router3.get("/user/all", getAllOrdersByUser);

// Get single order for a user
router3.get("/user/single", getSingleOrderByUser);

router3.delete("/delete", cancelOrder);

module.exports = router3;
