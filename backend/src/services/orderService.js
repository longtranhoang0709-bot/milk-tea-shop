const prisma = require("../db");

const getAllOrders = async () => {
  return await prisma.orders.findMany({
    orderBy: { id: "desc" }, // Đơn mới nhất lên đầu
    include: {
      users: {
        select: { name: true, email: true },
      },
      order_items: {
        include: {
          products: { select: { name: true, image: true } },
          order_toppings: {
            include: {
              toppings: { select: { name: true, price: true } },
            },
          },
        },
      },
    },
  });
};

const updateOrderStatus = async (id, status) => {
  return await prisma.orders.update({
    where: { id: Number(id) },
    data: { status: status },
  });
};

module.exports = { getAllOrders, updateOrderStatus };
