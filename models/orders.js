const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      trim: true, // removes leading/trailing spaces
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    items: {
      type: [Number],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one item is required in the order.",
      },
    },
    shippingFee: {
      type: Number,
      required: true,
      min: [0, "Shipping fee cannot be negative"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("orders", orderSchema);
