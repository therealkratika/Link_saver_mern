const Link = require("../models/Link");
const Joi = require("joi");

/* ================= VALIDATION SCHEMA ================= */

const linkSchema = Joi.object({
  url: Joi.string()
    .uri()
    .required(),

  title: Joi.string()
    .allow("")
    .optional(),

  favicon: Joi.string()
    .allow("")
    .optional(),

  tags: Joi.array()
    .items(Joi.string())
    .optional(),
});

/* ================= GET LINKS ================= */

exports.getLinks = async (req, res) => {
  try {
    const links = await Link.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(links);

  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

/* ================= CREATE LINK ================= */

exports.createLink = async (req, res) => {

  const { error } = linkSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      msg: error.details[0].message,
    });
  }

  try {

    let {
      url,
      title,
      favicon,
      tags,
    } = req.body;

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
      user: req.user.id,
    });

    res.json(link);

  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

/* ================= UPDATE LINK ================= */

exports.updateLink = async (req, res) => {

  const { error } = linkSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      msg: error.details[0].message,
    });
  }

  try {

    let {
      url,
      title,
      favicon,
      tags,
    } = req.body;

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

    const link = await Link.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        url,
        title,
        favicon,
        tags,
      },
      { new: true }
    );

    if (!link) {
      return res.status(404).json({
        msg: "Link not found",
      });
    }

    res.json(link);

  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

/* ================= DELETE LINK ================= */

exports.deleteLink = async (req, res) => {
  try {

    const deletedLink =
      await Link.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!deletedLink) {
      return res.status(404).json({
        msg: "Link not found",
      });
    }

    res.json({
      msg: "Deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

/* ================= TOGGLE FAVORITE ================= */

exports.toggleFavorite = async (req, res) => {
  try {

    const link = await Link.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!link) {
      return res.status(404).json({
        msg: "Link not found",
      });
    }

    link.isFavorite = !link.isFavorite;

    await link.save();

    res.json(link);

  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};