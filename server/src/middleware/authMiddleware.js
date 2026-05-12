const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ msg: "No token provided" });
  }
  const parts = authHeader.split(" ");
  const token = parts[1];

  if (!token) {
    return res.status(401).json({ msg: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid or expired token", error: err.message });
  }
};
module.exports = {verifyToken};