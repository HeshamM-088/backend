const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

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
