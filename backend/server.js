const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoutes = require("./src/routes/auth");
const productRoutes = require("./src/routes/product");
const toppingRoutes = require("./src/routes/topping");
const userRoutes = require("./src/routes/user");
const orderRoutes = require("./src/routes/order");
const dashboardRoutes = require("./src/routes/dashboard");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/toppings", toppingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("Backend quán trà sữa đang chạy...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
