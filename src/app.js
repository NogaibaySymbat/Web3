const express = require("express");
const path = require("path");

const blogRoutes = require("./routes/blogRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

// ✅ отдаём public (HTML/CSS/JS)
app.use(express.static(path.join(__dirname, "..", "public")));

// ✅ главная страница
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// API
app.use("/blogs", blogRoutes);

// errors
app.use(errorHandler);

module.exports = app;
