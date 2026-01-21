const express = require("express");
const path = require("path");

const blogRoutes = require("./routes/blogRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// API
app.use("/blogs", blogRoutes);

// errors
app.use(errorHandler);

module.exports = app;
