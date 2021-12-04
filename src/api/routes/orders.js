const express = require("express");
const router = express.Router();
// We can now use that router to register different routes!

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Orders were fetched",
  });
});

// 201 is best practice for everything was successful, posted!

router.post("/", (req, res, next) => {
  res.status(201).json({
    message: "Orders was created",
  });
});

router.get("/:orderID", (req, res, next) => {
  res.status(200).json({
    message: "Orders details",
    orderID: req.params.orderID,
  });
});

router.delete("/:orderID", (req, res, next) => {
  res.status(200).json({
    message: "Orders deleted",
    orderID: req.params.orderID,
  });
});

module.exports = router;
