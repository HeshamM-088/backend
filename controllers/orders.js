const orders = require("../models/orders");
const Order = require("../models/orders");
const User = require("../models/users");
const mongoose = require("mongoose");

const createOrder = async (req, res) => {
  const userId = req.params.uid;
  try {
    const userOrder = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }
    const newOrder = new Order(userOrder);

    const savedOrder = await newOrder.save();

    // Link the order to the user
    await User.findByIdAndUpdate(
      userId,
      { $push: { orders: savedOrder._id } },
      { new: true }
    );

    // Populate products inside items
    const populatedOrder = await savedOrder.populate("items.product");

    res.status(201).json(populatedOrder); // Return the populated order
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const getAllOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.uid;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: `Invalid User ID ${userId}` });
    }

    const user = await User.findById(userId).populate({
      path: "orders", // Orders of the user
      populate: {
        path: "items.product", // Populate the product inside items
        model: "products", // Ensure to link the Product model correctly
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.orders); // Send all populated orders
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// GET a single order by order ID for a specific user
const getSingleOrderByUser = async (req, res) => {
  try {
    const { userId, orderId } = req.params;

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
      return res.status(403).json({
        error: `Order does not belong to this user ${userId + " " + orderId}`,
      });
    }

    const order = await Order.findById(orderId).populate({
      path: "items.product", // Populate the product inside items
      model: "Product", // Link the Product model correctly
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order); // Return the populated order
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

    user.orders = user.orders.filter((id) => id.toString() !== orderId);
    await Order.deleteOne({ _id: orderId });
    await user.save();

    // Return the updated orders of the user
    const updatedUser = await User.findById(userId).populate({
      path: "orders",
      populate: {
        path: "items.product",
        model: "Product",
      },
    });
    res.status(200).json(updatedUser.orders);
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
