const express = require("express");
const cors = require("cors");
const router = require("./routes/products");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const router2 = require("./routes/users");
app.use(cors());
app.use(express.json());

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
app.use((req, res) => {
  return res.status(500).json({
    status: 500,
    data: { data: null, message: "invalid routes" },
  });
});

module.exports = app;

app.listen(3000);
