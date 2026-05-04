const prisma = require("../db");

const getAllProducts = async () => {
  return await prisma.products.findMany({
    include: {
      categories: true,
    },
  });
};

const createProduct = async (data) => {
  return await prisma.products.create({
    data: {
      name: data.name,
      price: parseFloat(data.price),
      image: data.image || null,
      description: data.description || null,
      category_id: parseInt(data.category_id),
    },
  });
};

const updateProduct = async (id, data) => {
  return await prisma.products.update({
    where: { id: parseInt(id) },
    data: {
      name: data.name,
      price: data.price ? parseFloat(data.price) : undefined,
      image: data.image,
      description: data.description,
      category_id: data.category_id ? parseInt(data.category_id) : undefined,
    },
  });
};

const deleteProduct = async (id) => {
  return await prisma.products.delete({
    where: { id: parseInt(id) },
  });
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
