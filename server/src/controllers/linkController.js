const Link = require("../models/Link");

// ✅ GET ALL LINKS
exports.getLinks = async (req, res) => {
  try {
    const links = await Link.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(links);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ CREATE LINK
exports.createLink = async (req, res) => {
  try {
    const link = await Link.create({
      ...req.body,
      user: req.user.id
    });

    res.json(link);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ UPDATE LINK
exports.updateLink = async (req, res) => {
  try {
    const link = await Link.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    res.json(link);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ DELETE LINK
exports.deleteLink = async (req, res) => {
  try {
    await Link.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ⭐ TOGGLE FAVORITE
exports.toggleFavorite = async (req, res) => {
  try {
    const link = await Link.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    link.isFavorite = !link.isFavorite;
    await link.save();

    res.json(link);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};