const Order = require("../models/orders");
const User = require("../models/users");
const Product = require("../models/product");
const mongoose = require("mongoose");

// إنشاء طلب جديد
const createOrder = async (req, res) => {
  const userId = req.params.uid;

  try {
    const userOrder = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    // التأكد من كل منتج أنه موجود وفيه مخزون كافي
    for (const item of userOrder.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product ${item.product} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        });
      }
    }

    // إنشاء الطلب
    const newOrder = new Order(userOrder);
    const savedOrder = await newOrder.save();

    // ربط الطلب بالمستخدم
    await User.findByIdAndUpdate(
      userId,
      { $push: { orders: savedOrder._id } },
      { new: true }
    );

    // تحديث المخزون
    for (const item of userOrder.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    // إرجاع الطلب مع المنتجات
    const populatedOrder = await savedOrder.populate("items.product");

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
        model: "Product",
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
        error: `Order does not belong to this user ${userId} ${orderId}`,
      });
    }

    const order = await Order.findById(orderId).populate({
      path: "items.product",
      model: "Product",
    });

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

module.exports = {
  createOrder,
  getAllOrdersByUser,
  getSingleOrderByUser,
  cancelOrder,
};
