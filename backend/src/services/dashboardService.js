const prisma = require("../db");

const getDashboardStats = async () => {
  // 1. Tổng doanh thu (Chỉ tính các đơn 'completed')
  const revenueAgg = await prisma.orders.aggregate({
    _sum: { total_price: true },
    where: { status: "completed" },
  });
  const totalRevenue = revenueAgg._sum.total_price || 0;

  // 2. Tổng số đơn hàng (Tất cả trạng thái)
  const totalOrders = await prisma.orders.count();

  // 3. Số ly đã bán (Lấy từ bảng order_items của các đơn 'completed')
  const cupsAgg = await prisma.order_items.aggregate({
    _sum: { quantity: true },
    where: { orders: { status: "completed" } },
  });
  const totalCups = cupsAgg._sum.quantity || 0;

  // 4. Lấy 5 đơn hàng mới nhất
  const recentOrders = await prisma.orders.findMany({
    take: 5,
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      total_price: true,
      status: true,
      created_at: true,
      customer_name: true,
      users: { select: { name: true } },
    },
  });

  return { totalRevenue, totalOrders, totalCups, recentOrders };
};

module.exports = { getDashboardStats };
