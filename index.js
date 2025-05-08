const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
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

app.use("/", (req, res) => {
  return res.status(200).json({
    msg: "done for home page",
  });
});

app.use((req, res) => {
  return res.status(500).json({
    status: 500,
    data: { data: null, message: "invalid routes" },
  });
});

module.exports = app;
