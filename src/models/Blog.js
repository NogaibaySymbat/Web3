const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    body: { type: String },
    author: { type: String, default: "Anonymous", trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
