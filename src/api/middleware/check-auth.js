const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Auth failed" });
  }
};
