const dashboardService = require('../services/dashboardService');

const getDashboardData = async (req, res) => {
  try {
    const data = await dashboardService.getDashboardStats();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi tải Dashboard", error: error.message });
  }
};

module.exports = { getDashboardData };