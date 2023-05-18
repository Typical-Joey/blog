const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
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

// Setting up mongoose
mongoose
  .connect(
    `mongodb+srv://josephtcapocci:${process.env.REACT_APP_DBPASSWORD}@cluster0.afhevte.mongodb.net/?retryWrites=true&w=majority`,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
    }
  )
  .catch((error) =>
    console.log(`Error! Please check database credentials. ${error}`)
  );

// Setting up collection Schema
const postSchema = mongoose.Schema({
  name: String,
  body: String,
});

const Post = new mongoose.model("Post", postSchema);

const post1 = new Post({
  name: "Post 1",
  body: "Just a test post for debuggin reasons.",
});

const post2 = new Post({
  name: "Post 2",
  body: "Some other post for debugging reasons",
});

const defaultPosts = [post1, post2];

// Post.insertMany(defaultPosts, function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("All items added succesfully");
//   }
// });

const homeContent =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

// Home Page
app.get("/", function (req, res) {
  Post.find(function (err, posts) {
    if (!err) {
      res.render("home", {
        homeContent: homeContent,
        blogPosts: posts,
      });
    }
  });
});

// Sends user to url of a post
app.post("/", function (req, res) {
  res.redirect("/posts/" + req.body.postID);
});

// Accessing posts using custom url
app.get("/posts/:post", function (req, res) {
  const postID = req.params.post;
  Post.findById(postID, function (err, post) {
    if (err) {
      console.log(err);
    } else {
      res.render("post", {
        postName: post.name,
        postBody: post.body,
      });
    }
  });
});

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

// Compose a new post
app.post("/compose", function (req, res) {
  const post = new Post({
    name: req.body.postName,
    body: req.body.postBody,
  });
  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

// Starts the server
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is now listening");
});
