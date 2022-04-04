const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const featureRoutes = require("./api/routes/feature");
const userRoutes = require("./api/routes/user");

const app = express();
mongoose.connect("mongodb+srv://harpay:" + process.env.MONGO_ATLAS_PW + "@harpayapi.4a4zw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");

// app.use(morgan("dev")); // log the request
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// setup middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // allow cors origin (from different port)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"); // set what type of header that we alloc
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET"); // set type of method that we allow
    return res.status(200).json({});
  }
  next();
});

app.use("/fitur", featureRoutes);
app.use("/auth", userRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    error: "Request not found",
  });
});

module.exports = app;
