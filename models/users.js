const mongoose = require("mongoose");
require("../models/product")
const bcrypt = require("bcrypt");



const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required :[true,"Username required !"],
    },
    email: {
        type: String,
        required: [true, "Email address required !"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password required !"],
          min: [8, "Password must be at least 8 characters"],
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default :"user",
    },
    cartItems: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
            quantity: {
                type: Number,
                default: 1,
            }
        },
      ],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId,  ref: "product" }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "orders"}],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }

});

userSchema.pre("save", async function (next) {
    try {
        if (this.isModified("password")) { 
            //hashing password with generated salt 10iterations
        this.password = await bcrypt.hash(this.password, 10);
        }
        next();   
    }catch (error) {
        next(error);
    }
})
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};
  

module.exports = mongoose.model("users", userSchema);