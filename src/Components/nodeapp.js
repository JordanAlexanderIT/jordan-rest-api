const express = require("express");
const nodeapp = express();

const productRoutes = require("../api/routes/products");

nodeapp.use("/products", productRoutes);

module.exports = nodeapp;
