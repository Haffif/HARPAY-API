const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const featureRoutes = require("./api/routes/feature");
const userRoutes = require("./api/routes/user");
const transactionRoutes = require("./api/routes/transaction");
const listrikRoutes = require("./api/routes/listrik"); 

const app = express();
mongoose.connect("mongodb://harpay:harpay123zz@cluster0-shard-00-00.b485m.mongodb.net:27017,cluster0-shard-00-01.b485m.mongodb.net:27017,cluster0-shard-00-02.b485m.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-tjyizg-shard-0&authSource=admin&retryWrites=true&w=majority");

// app.use(morgan("dev")); // log the request
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// setup middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // allow cors origin (from different port)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"); // set what type of header that we allow
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET"); // set type of method that we allow
    return res.status(200).json({});
  }
  next();
});

app.use("/fitur", featureRoutes);
app.use("/auth", userRoutes);
app.use("/transaksi", transactionRoutes);
app.use("/listrik", listrikRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    error: "Request not found",
  });
});

module.exports = app;
