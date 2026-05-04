const orderService = require('../services/orderService');

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách đơn hàng", error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedOrder = await orderService.updateOrderStatus(id, status);
    res.status(200).json({ message: "Cập nhật trạng thái thành công!", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái", error: error.message });
  }
};

module.exports = { getAllOrders, updateOrderStatus };