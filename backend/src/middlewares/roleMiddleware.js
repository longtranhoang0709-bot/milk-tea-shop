// Middleware kiểm tra vai trò người dùng
module.exports = function requiredRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json("Bạn chưa đăng nhập!");

    const userRoles = req.user.roles || [];

    const hasPermission = userRoles.some((role) => allowedRoles.includes(role));

    if (!hasPermission) {
      return res.status(403).json("Bạn không có quyền truy cập!");
    }

    next();
  };
};
