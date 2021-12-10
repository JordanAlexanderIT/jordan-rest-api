const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  //reject a file
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/svg+xml"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 },
  fileFilter: fileFilter,
});

// We can now use that router to register different routes!
const Product = require("../models/product");

router.get("/", (req, res, next) => {
  // Again using the product object I'm importing
  // Using simply find() will find all, but you can add 'where' to this or limit
  Product.find()
    .select("name price _id productImage")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            _id: doc._id,
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/", upload.single("productImage"), (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  // .save() is provided by mongoose, exec() turns it into a promise
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Handling POST requests to /products",
        createdProduct: product,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get("/:productID", (req, res, next) => {
  const id = req.params.productID;
  // Product model, imported
  Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then((doc) => {
      console.log("From MongoDB", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res
          .status(400)
          .json({ message: "No valid entry found for the provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product updated successfully",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .exec()
    .then((result) =>
      res.status(200).json({
        message: "Product successfully deleted",
      })
    )
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
