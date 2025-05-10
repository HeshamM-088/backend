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
      enum: ["pending", "shipped", "cancelled"],
      default: "pending",
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
    ],
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
