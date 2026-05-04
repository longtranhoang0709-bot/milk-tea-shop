const productService = require("../services/productService");

const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách sản phẩm",
      error: error.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
    }

    const newProduct = await productService.createProduct(data);
    res
      .status(201)
      .json({ message: "Thêm món thành công!", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Lỗi", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await productService.updateProduct(id, data);
    res
      .status(200)
      .json({ message: "Cập nhật thành công!", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Lỗi", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await productService.deleteProduct(id);
    res.status(200).json({ message: "Đã xóa món khỏi thực đơn" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa đồ uống", error: error.message });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
