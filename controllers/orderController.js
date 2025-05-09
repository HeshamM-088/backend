const Order = require("../models/orders");
const User = require("../models/users");

// CREATE a new order and link it to a user
const createOrder = async (req, res) => {
  try {
    const { userId, address, items, shippingFee } = req.body;

    // Create new order
    const newOrder = new Order({ address, items, shippingFee });

    const savedOrder = await newOrder.save();

    // Link order to user
    await User.findByIdAndUpdate(
      userId,
      { $push: { orders: savedOrder._id } },
      { new: true }
    );

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET all orders for a specific user
const getAllOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch user and populate orders
    const user = await User.findById(userId).populate("orders");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET a single order by order ID for a specific user
const getSingleOrderByUser = async (req, res) => {
  try {
    const { userId, orderId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if this order belongs to this user
    if (!user.orders.includes(orderId)) {
      return res
        .status(403)
        .json({ error: "Order does not belong to this user" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrdersByUser,
  getSingleOrderByUser,
};
