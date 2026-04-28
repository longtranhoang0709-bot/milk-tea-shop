const authService = require("../services/authService");

// 1. ĐĂNG KÝ
exports.register = async (req, res) => {
  try {
    const { email, password, name, so_dien_thoai, dia_chi } = req.body;

    // Kiểm tra đầu vào cơ bản
    if (!email || !password || !name) {
      return res
        .status(400)
        .json("Vui lòng nhập đầy đủ email, mật khẩu và tên!");
    }

    await authService.register({
      email,
      password,
      name,
      so_dien_thoai,
      dia_chi,
    });
    res.status(200).json("Đăng ký tài khoản thành công!");
  } catch (err) {
    if (err.message === "EMAIL_EXISTS") {
      return res.status(409).json("Email này đã được sử dụng!");
    }
    console.error(">>> LỖI TẠI REGISTER:", err);
    res.status(500).json({ error: "Lỗi đăng ký", details: err.message });
  }
};

// 2. ĐĂNG NHẬP
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json("Vui lòng nhập email và mật khẩu!");
    }

    const { accessToken, refreshToken, user } = await authService.login(
      email,
      password,
    );

    // Lưu Refresh Token vào HTTP-Only Cookie để bảo mật
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // Đổi thành true nếu chạy trên HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    res.status(200).json({
      message: "Đăng nhập thành công!",
      accessToken,
      user,
    });
  } catch (err) {
    if (err.message === "USER_NOT_FOUND") {
      return res.status(404).json("Tài khoản không tồn tại!");
    }
    if (err.message === "WRONG_PASSWORD") {
      return res.status(400).json("Mật khẩu không chính xác!");
    }
    res.status(500).json({ error: "Lỗi đăng nhập", details: err.message });
  }
};

// 3. REFRESH TOKEN (Cấp lại Access Token mới)
exports.refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    const newAccessToken = await authService.refresh(token);

    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    if (err.message === "NO_TOKEN") {
      return res
        .status(401)
        .json("Phiên làm việc hết hạn, vui lòng đăng nhập lại!");
    }
    if (err.message === "INVALID_TOKEN") {
      return res.status(403).json("Token không hợp lệ!");
    }
    res.status(500).json({ error: "Lỗi refresh token", details: err.message });
  }
};

// 4. ĐĂNG XUẤT
exports.logout = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
  res.status(200).json("Đăng xuất thành công!");
};

// 5. QUÊN MẬT KHẨU
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json("Vui lòng cung cấp email!");

    await authService.forgotPassword(email);
    res
      .status(200)
      .json("Hướng dẫn đặt lại mật khẩu đã được gửi vào email của bạn!");
  } catch (err) {
    if (err.message === "EMAIL_NOT_FOUND") {
      return res.status(404).json("Email không tồn tại trong hệ thống!");
    }
    res.status(500).json({ error: "Lỗi gửi email", details: err.message });
  }
};

// 6. ĐẶT LẠI MẬT KHẨU
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json("Thiếu token hoặc mật khẩu mới!");
    }

    await authService.resetPassword(token, newPassword);
    res
      .status(200)
      .json("Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.");
  } catch (err) {
    if (err.message === "INVALID_TOKEN") {
      return res.status(400).json("Mã xác thực không hợp lệ!");
    }
    if (err.message === "TOKEN_EXPIRED") {
      return res.status(400).json("Mã xác thực đã hết hạn (15 phút)!");
    }
    res
      .status(500)
      .json({ error: "Lỗi đặt lại mật khẩu", details: err.message });
  }
};
