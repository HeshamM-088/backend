const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Remove extra spaces around the name
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be less than 0"], // Ensure price is not negative
  },
  category: {
    type: String,
    enum: ["men", "women", "accessories"], // Define allowed categories
    required: true,
    trim: true,
  },
  subcategory: {
    type: String,
    enum: [
      "Tshirt",
      "Hoodie",
      "Shirt",
      "Dress",
      "Blouse",
      "Pants",
      "Necklace",
      "Earring",
      "sunglasses",
      "Bag",
      "Watch",
    ], // Define allowed categories
    required: true,
    trim: true,
  },
  image: {
    type: String, // This could be a URL or file path to the product image
    required: true,
  },
  stock: {
    type: Number,
    default: 0, // Default stock to 0 if not specified
    min: [0, "Stock cannot be negative"], // Ensure stock is not negative
  },
  available: {
    type: Boolean,
    default: true, // true = available, false = not available
  },
  rating: {
    type: Number,
    default: 0, // Default to 0 if no rating is provided
    min: [0, "Rating cannot be less than 0"],
    max: [5, "Rating cannot be more than 5"],
  },
});

module.exports = mongoose.model("Product", productSchema);
