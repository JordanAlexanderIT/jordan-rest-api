const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// We can now use that router to register different routes!
// Don't forget to import the model I just created :D
const Order = require("../models/order");
// To validate a product exists before posting an order, makes sense to import Product so it can be used inside the post route in validation
const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    // Populate needs a reference property, here product is our only ref property, second argument can be similar to select where you choose which referenced fields you wish to populate
    .populate("product")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          // ***DONT FORGET THE RETURN HERE***
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// 201 is best practice for everything was successful, posted!
// save gets a promise by default
router.post("/", (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get("/:orderId", (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate("product")
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:orderId", (req, res, next) => {
  Order.deleteOne({ _id: req.params.orderId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Order deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
