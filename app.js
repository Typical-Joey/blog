const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();


// Setting up express and ejs
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));


// Setting up mongoose
mongoose.connect("mongodb://localhost/blogDB", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
});


// Setting up collection Schema
const postSchema = mongoose.Schema({
    name: String,
    body: String
});

const Post = new mongoose.model("Post", postSchema);

const post1 = new Post({
    name: "Post 1",
    body: "Just a test post for debuggin reasons."
});

const post2 = new Post({
    name: "Post 2",
    body: "Some other post for debugging reasons"
});

const defaultPosts = [post1, post2];

const blogPosts = [];
const homeContent = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

// Home Page
app.get("/", function (req, res) {
    res.render("home", {
        homeContent: homeContent,
        blogPosts: blogPosts
    });
});

// Sends user to url of a post
app.post("/", function (req, res) {
    res.redirect("/posts/" + req.body.postName.replace(/ /g, "-"));
});

// Accessing posts using custom url
app.get("/posts/:post", function (req, res) {

    blogPosts.forEach(function (post) {
        let postTitle = post.title.replace(/ /g, "-");
        let lowerTitle = _.toLower(postTitle);
        if (postTitle == req.params.post || lowerTitle == req.params.post) {
            res.render("post", {
                postTitle: post.title,
                postBody: post.body
            });
        };
    });

});


// About Me Page
app.get("/about", function (req, res) {
    res.render("about");
});


// Contact Me Page
app.get("/contact", function (req, res) {
    res.render("contact");
})


// Compose a new post
app.get("/compose", function (req, res) {
    res.render("compose");
});

app.post("/compose", function (req, res) {
    const post = {
        title: req.body.postTitle,
        body: req.body.postBody
    };
    blogPosts.push(post);

    res.redirect("/");
})


// Starts the server
app.listen(process.env.PORT || 3000, function () {
    console.log("Server is now listening");
});