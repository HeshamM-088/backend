const Order = require("../models/orders");
const User = require("../models/users");
const mongoose = require("mongoose");

const createOrder = async (req, res) => {
  try {
    const { userId, address, items } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const newOrder = new Order({
      address,
      items,
      shippingFee: Math.round((Math.random() * 100) % 51),
    });

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

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const user = await User.findById(userId).populate({
      path: "orders",
      populate: {
        path: "items",
        model: "products",
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSingleOrderByUser = async (req, res) => {
  try {
    const { userId, orderId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: `Invalid order ID: ${orderId}` });
    }

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

    const order = await Order.findById(orderId).populate("items");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { userId, orderId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: `Invalid order ID: ${orderId}` });
    }
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.orders.includes(orderId)) {
      return res
        .status(403)
        .json({ error: "Order does not belong to this user" });
    }

    user.orders = user.orders.filter((id) => id != orderId);
    await Order.deleteOne({ _id: orderId });
    await user.save();
    res.status(200).json({ orders: user.orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrdersByUser,
  getSingleOrderByUser,
  cancelOrder,
};
