const express = require("express");
const nodeapp = express();
const morgan = require("morgan"); // Morgan is for great error-handling
const bodyParser = require("body-parser");

const productRoutes = require("../api/routes/products");
const orderRoutes = require("../api/routes/orders");

nodeapp.use(morgan("dev"));
nodeapp.use(bodyParser.urlencoded({ extended: false }));
nodeapp.use(bodyParser.json());

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
