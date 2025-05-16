const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
     user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "cancelled"],
      default: "pending",
    },
   
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: [1, "Quantity must be at least 1"],
        },
      },
    ],
    shippingFee: {
      type: Number,
      required: true,
      min: [0, "Shipping fee cannot be negative"],
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Price fee cannot be negative"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("orders", orderSchema);
