const express = require("express");
const cors = require("cors");
const router = require("./routes/products");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const router2 = require("./routes/users");
const router3 = require("./routes/orderRoutes");
const cartRouter = require("./routes/cart");
const wishlistRouter = require("./routes/wishlist");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //helps parse form-data fields

const DB = process.env.DB;
mongoose
  .connect(DB)
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

// app.use("/", (req, res) => {
//   return res.status(200).json({
//     msg: "done for home page",
//   });
// });

app.use("/api/products", router);
app.use("/api/users", router2);
app.use("/api/orders", router3);
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishlistRouter);

app.use((req, res) => {
  return res.status(500).json({
    status: 500,
    data: { data: null, message: "invalid routes" },
  });
});

module.exports = app;

// app.listen(3000);
