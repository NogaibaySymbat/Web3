const mongoose = require("mongoose");
const Blog = require("../models/Blog");

// GET /blogs
const getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    next(err);
  }
};

// GET /blogs/:id
const getBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    res.status(200).json(blog);
  } catch (err) {
    next(err);
  }
};

// POST /blogs
const createBlog = async (req, res, next) => {
  try {
    const { title, body, author } = req.body;

    if (!title || !body) {
        return res.status(400).json({ error: "title and body are required" });
    }
    const blog = await Blog.create({
        title,
        body,
        author: author?.trim() || "Anonymous"
    });
    
    res.status(201).json(blog);
  } catch (err) {
    next(err);
  }
};

// PUT /blogs/:id
const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const updated = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Blog not found" });

    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /blogs/:id
const deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const deleted = await Blog.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Blog not found" });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog
};
