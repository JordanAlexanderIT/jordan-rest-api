const express = require("express");
const nodeapp = express();
const morgan = require("morgan"); // Morgan is for great error-handling
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("../api/routes/products");
const orderRoutes = require("../api/routes/orders");

// mongoose.connect(
//   "mongodb+srv://CaptSoda:V4l4rD0haeri5%@cluster0.tsnrr.mongodb.net/dbpets?retryWrites=true&w=majority"
// );

mongoose.connect(
  "mongodb+srv://CaptSoda:V4l4rM0rghuli5@cluster0.tsnrr.mongodb.net/dbpets?retryWrites=true&w=majority"
);

nodeapp.use(morgan("dev"));
nodeapp.use("/uploads", express.static("uploads"));
nodeapp.use(bodyParser.urlencoded({ extended: false }));
nodeapp.use(bodyParser.json());
nodeapp.use((req, res, next) => {
  res.header("Access-control-allow-origin", "*");
  res.header(
    "Access-control-allow-headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    res.status(200).json({});
  }
  next();
});

nodeapp.use("/products", productRoutes);
nodeapp.use("/orders", orderRoutes);

nodeapp.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
nodeapp.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = nodeapp;
