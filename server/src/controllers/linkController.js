const Link = require("../models/Link");
exports.getLinks = async (req, res) => {
  try {
    const links = await Link.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(links);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
exports.createLink = async (req, res) => {

  try {

    let {
      url,
      title,
      favicon,
      tags
    } = req.body;

    // validation
    if (!url || typeof url !== "string") {
      return res.status(400).json({
        msg: "Invalid URL"
      });
    }

    // sanitize
    url = url.trim();
    title = typeof title === "string"
      ? title.trim()
      : "";

    favicon = typeof favicon === "string"
      ? favicon.trim()
      : "";

    tags = Array.isArray(tags)
      ? tags.map(tag => String(tag).trim())
      : [];

    const link = await Link.create({
      url,
      title,
      favicon,
      tags,
      user: req.user.id
    });

    res.json(link);

  } catch (err) {

    res.status(500).json({
      msg: err.message
    });
  }
};
exports.updateLink = async (req, res) => {
  try {
    const {
  url,
  title,
  favicon,
  tags
} = req.body;

    const link = await Link.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { url, title, favicon, tags },
      { new: true }
    );

    res.json(link);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
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