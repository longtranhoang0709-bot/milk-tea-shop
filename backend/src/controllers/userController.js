const userService = require('../services/userService');

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy danh sách", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await userService.updateUser(id, req.body);
    res.status(200).json({ message: "Cập nhật thành công!", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    res.status(200).json({ message: "Xóa thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa", error: error.message });
  }
};

module.exports = { getAllUsers, updateUser, deleteUser };