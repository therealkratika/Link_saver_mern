const express = require("express");
const router = express.Router();

const {
  getLinks,
  createLink,
  updateLink,
  deleteLink,
  toggleFavorite
} = require("../controllers/linkController");

const { verifyToken } = require("../middleware/authMiddleware");

// 🔐 all routes protected
router.use(verifyToken);

router.get("/", getLinks);
router.post("/", createLink);
router.put("/:id", updateLink);
router.delete("/:id", deleteLink);
router.patch("/:id/favorite", toggleFavorite);

module.exports = router;