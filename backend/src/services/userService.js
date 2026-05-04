const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

const getAllUsers = async () => {
  return await prisma.users.findMany({
    orderBy: { id: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      so_dien_thoai: true,
      dia_chi: true,
      role: true,
      status: true,
      created_at: true,
    },
  });
};

const updateUser = async (id, data) => {
  const updateData = {
    name: data.name,
    so_dien_thoai: data.so_dien_thoai,
    dia_chi: data.dia_chi,
    role: data.role,
    status: data.status,
  };

  return await prisma.users.update({
    where: { id: Number(id) },
    data: updateData,
  });
};

const deleteUser = async (id) => {
  return await prisma.users.delete({ where: { id: Number(id) } });
};

module.exports = { getAllUsers, updateUser, deleteUser };
