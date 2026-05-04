const toppingService = require('../services/toppingService');

const getAllToppings = async (req, res) => {
  try {
    const toppings = await toppingService.getAllToppings();
    res.status(200).json(toppings);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách topping", error: error.message });
  }
};

const createTopping = async (req, res) => {
  try {
    const newTopping = await toppingService.createTopping(req.body, req.file);
    res.status(201).json({ message: "Thêm Topping thành công!", topping: newTopping });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm mới", error: error.message });
  }
};

const updateTopping = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTopping = await toppingService.updateTopping(id, req.body, req.file);
    res.status(200).json({ message: "Cập nhật thành công!", topping: updatedTopping });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật", error: error.message });
  }
};

const deleteTopping = async (req, res) => {
  try {
    const { id } = req.params;
    await toppingService.deleteTopping(id);
    res.status(200).json({ message: "Xóa thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa", error: error.message });
  }
};

module.exports = { getAllToppings, createTopping, updateTopping, deleteTopping };