const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const toppingController = require("../controllers/toppingController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
router.get("/", toppingController.getAllToppings);
router.post("/", upload.single("image"), toppingController.createTopping);
router.put("/:id", upload.single("image"), toppingController.updateTopping);
router.delete("/:id", toppingController.deleteTopping);

module.exports = router;
