const Order = require("../models/orders");
const User = require("../models/users");
const Product = require("../models/product");
const mongoose = require("mongoose");

 
 const createOrder = async (req, res) => {
   const { userId, address, items, shippingFee, totalPrice } = req.body;
   
  try {
     if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }
 
    const order = new Order({
      user: userId,
      address,
      items,
      shippingFee,
      totalPrice,
    });
    const savedOrder = await order.save();
     await User.findByIdAndUpdate(
      userId,
      { $push: { orders: savedOrder._id } },
      { new: true }
    );
    const populatedOrder = await Order.findById(savedOrder._id) .populate("items.product");
=======
 
 

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// جلب كل الطلبات الخاصة بمستخدم
const getAllOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.uid;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: `Invalid User ID ${userId}` });
    }

    const user = await User.findById(userId).populate({
      path: "orders",
      populate: {
        path: "items.product",
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

// جلب طلب واحد فقط بموجب المستخدم
const getSingleOrderByUser = async (req, res) => {
  try {
        const { uid, oid } = req.params;


    if (!mongoose.Types.ObjectId.isValid(uid)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(oid)) {
      return res.status(400).json({ message: `Invalid order ID: ${oid}` });
    }

    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.orders.includes(oid)) {
      return res.status(403).json({
        error: `Order does not belong to this user ${uid} ${oid}`,
      });
    }

    const order = await Order.findById(oid).populate("items.product");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// إلغاء الطلب
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

    // حذف الطلب من user
    user.orders = user.orders.filter((id) => id.toString() !== orderId);
    await Order.deleteOne({ _id: orderId });
    await user.save();

    // رجع الطلبات بعد التحديث
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

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate({
      path: "items.product",
      model: "products",
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrdersByUser,
  getSingleOrderByUser,
  cancelOrder,
  getAllOrders,
};
