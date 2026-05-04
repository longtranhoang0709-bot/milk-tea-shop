const prisma = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const ACCESS_KEY = process.env.ACCESS_KEY || "access_secret_key_123";
const REFRESH_KEY = process.env.REFRESH_KEY || "refresh_secret_key_789";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dohoangphuoc10@gmail.com",
    pass: "eswa qlpu sbpf gczk",
  },
});

class AuthService {
  async register({ email, password, name, so_dien_thoai, dia_chi }) {
    const check = await prisma.users.findUnique({ where: { email } });
    if (check) throw new Error("EMAIL_EXISTS");

    const hashed = bcrypt.hashSync(password, 10);

    return await prisma.users.create({
      data: {
        name,
        email,
        password: hashed,
        so_dien_thoai,
        dia_chi,
      },
    });
  }

  async login(email, password) {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) throw new Error("USER_NOT_FOUND");

    const checkPass = bcrypt.compareSync(password, user.password);
    if (!checkPass) throw new Error("WRONG_PASSWORD");

    const roles = [user.role];

    const accessToken = jwt.sign({ id: user.id, roles }, ACCESS_KEY, {
      expiresIn: "20m",
    });
    const refreshToken = jwt.sign({ id: user.id, roles }, REFRESH_KEY, {
      expiresIn: "7d",
    });

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, roles },
    };
  }

  async refresh(token) {
    if (!token) throw new Error("NO_TOKEN");
    try {
      const decoded = jwt.verify(token, REFRESH_KEY);
      return jwt.sign({ id: decoded.id, roles: decoded.roles }, ACCESS_KEY, {
        expiresIn: "20m",
      });
    } catch (err) {
      throw new Error("INVALID_TOKEN");
    }
  }

  async forgotPassword(email) {
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) throw new Error("EMAIL_NOT_FOUND");

    const token = crypto.randomBytes(32).toString("hex");

    await prisma.password_resets.deleteMany({ where: { email } });
    await prisma.password_resets.create({ data: { email, token } });

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    await transporter.sendMail({
      from: '"Milk Tea Shop" <no-reply@milktea.com>',
      to: email,
      subject: "Đặt lại mật khẩu",
      html: `<p>Nhấp vào link để đặt lại mật khẩu (Hết hạn sau 15p): <a href="${resetLink}">${resetLink}</a></p>`,
    });
  }

  async resetPassword(token, newPassword) {
    const resetReq = await prisma.password_resets.findFirst({
      where: { token },
    });
    if (!resetReq) throw new Error("INVALID_TOKEN");

    if (new Date() - new Date(resetReq.created_at) > 900000)
      throw new Error("TOKEN_EXPIRED");

    const hashed = bcrypt.hashSync(newPassword, 10);

    await prisma.users.update({
      where: { email: resetReq.email },
      data: { password: hashed },
    });
    await prisma.password_resets.deleteMany({ where: { token } });
  }
}

module.exports = new AuthService();
