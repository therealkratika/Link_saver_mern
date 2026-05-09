const Link = require("../models/Link.js");
const Joi = require("joi");
const linkSchema = Joi.object({
  url: Joi.string().uri().required(),
  title: Joi.string().allow("").optional(),
  favicon: Joi.string().allow("").optional(),
  tags: Joi.array().items(Joi.string().allow("")).optional(),
});
const validateBody = (body) => {
  const { error } = linkSchema.validate(body);
  if (error) return error.details[0].message;
  return null;
};

const sanitizeLinkData = (data) => {
  const { url, title, favicon, tags } = data;
  
  return {
    url: String(url).trim(),
    title: typeof title === "string" ? title.trim() : "Untitled",
    favicon: typeof favicon === "string" ? favicon.trim() : "",
    tags: Array.isArray(tags) 
      ? tags.map((tag) => String(tag).trim()).filter(tag => tag.length > 0) 
      : [],
  };
};

const sendError = (res, err, status = 500) => {
  res.status(status).json({ msg: typeof err === "string" ? err : err.message });
};
exports.getLinks = async (req, res) => {
  try {
    const links = await Link.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(links);
  } catch (err) {
    sendError(res, err);
  }
};
exports.createLink = async (req, res) => {
  const validationError = validateBody(req.body);
  if (validationError) {
    return sendError(res, validationError, 400);
  }

  try {
    const sanitizedData = sanitizeLinkData(req.body);
    const existingLink = await Link.findOne({
      url: sanitizedData.url,
      user: req.user.id,
    });

    if (existingLink) {
      return sendError(res, "This link is already in your collection", 400);
    }

    const link = await Link.create({
      ...sanitizedData,
      user: req.user.id,
    });

    res.status(201).json(link);
  } catch (err) {
    sendError(res, err);
  }
};

exports.updateLink = async (req, res) => {
  const validationError = validateBody(req.body);
  if (validationError) return sendError(res, validationError, 400);

  try {
    const sanitizedData = sanitizeLinkData(req.body);
    
    const link = await Link.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: sanitizedData }, 
      { new: true, runValidators: true }
    );

    if (!link) return sendError(res, "Link not found", 404);
    res.json(link);
  } catch (err) {
    sendError(res, err);
  }
};
exports.deleteLink = async (req, res) => {
  try {
    const deletedLink = await Link.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deletedLink) return sendError(res, "Link not found", 404);
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    sendError(res, err);
  }
};
exports.toggleFavorite = async (req, res) => {
  try {
    const link = await Link.findOne({ _id: req.params.id, user: req.user.id });
    if (!link) return sendError(res, "Link not found", 404);

    link.isFavorite = !link.isFavorite;
    await link.save();
    res.json(link);
  } catch (err) {
    sendError(res, err);
  }
};