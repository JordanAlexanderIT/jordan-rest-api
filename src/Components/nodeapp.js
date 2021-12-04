const express = require("express");
const nodeapp = express();

const productRoutes = require("../api/routes/products");
const orderRoutes = require("../api/routes/orders");

nodeapp.use("/products", productRoutes);

nodeapp.use("/orders", orderRoutes);

module.exports = nodeapp;
