const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();

// Setting up express and ejs
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// About Me Page
app.get("/about", function (req, res) {
  res.render("about");
});

// Contact Me Page
app.get("/contact", function (req, res) {
  res.render("contact");
});

// Render compose page
app.get("/compose", function (req, res) {
  res.render("compose");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is now listening");
});
