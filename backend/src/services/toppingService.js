const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient(); 

const getAllToppings = async () => {
  return await prisma.toppings.findMany({
    orderBy: { id: 'desc' } 
  });
};

const createTopping = async (data, file) => {
  const imagePath = file ? `/uploads/${file.filename}` : null;

  return await prisma.toppings.create({
    data: {
      name: data.name,
      price: Number(data.price),
      image: imagePath
    }
  });
};

const updateTopping = async (id, data, file) => {
  const updateData = {
    name: data.name,
    price: Number(data.price)
  };

  if (file) {
    updateData.image = `/uploads/${file.filename}`;
  }

  return await prisma.toppings.update({
    where: { id: Number(id) },
    data: updateData
  });
};

const deleteTopping = async (id) => {
  return await prisma.toppings.delete({
    where: { id: Number(id) }
  });
};

module.exports = { getAllToppings, createTopping, updateTopping, deleteTopping };