const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const header = req.headers["authorization"];
  if (!header) {
    return res.status(401).json({ message: "Authorization header required." });
  }
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : header;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Token missing in Authorization header." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized invalid token" });
    }
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Unauthorized invalid/expired token" });
  }
}
module.exports = {verifyToken};
