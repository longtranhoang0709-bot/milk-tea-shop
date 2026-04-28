const jwt = require("jsonwebtoken");
const ACCESS_KEY = process.env.ACCESS_KEY || "access_secret_key_123";

// Middleware xác thực token
module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader)
    return res
      .status(401)
      .json("Bạn chưa đăng nhập! (Không có Authorization Header)");

  const token = authHeader.split(" ")[1];

  if (!token) return res.status(401).json("Token không tồn tại!");

  jwt.verify(token, ACCESS_KEY, (err, user) => {
    if (err) return res.status(403).json("Token không hợp lệ hoặc đã hết hạn!");

    req.user = user;
    next();
  });
};
