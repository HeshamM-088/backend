const express = require("express");
const router3 = express.Router();
const {
  createOrder,
  getAllOrdersByUser,
  getSingleOrderByUser,
  cancelOrder,
  getAllOrders,
} = require("../controllers/orders");

// Create order
router3.post("/", createOrder);

// Get all orders for a specific user
router3.get("/:uid", getAllOrdersByUser);

// Get single order for a user
router3.get("/:uid/:oid", getSingleOrderByUser);

router3.delete("/", cancelOrder);

router3.get("/", getAllOrders);
module.exports = router3;
