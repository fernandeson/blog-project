// ------------ IMPORTS ------------ //
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
const _ = require('lodash');

// ------------ GLOBAL VARIABLES ------------ //
const homeStartingContent = "This is a simple blog website, made with EJS Templates, Express and Mongoose. Add a new post by clicking in the button below."
const aboutContent = "You should add posts about anything you want! They will be locally saved and rendered in the home page."
const contactContent = "To contact me, visit my GitHub: https://github.com/fernandeson or LinkedIn: https://www.linkedin.com/in/nat%C3%A1lia-fernandes-359311145/"

// ------------ MONGOOSE ------------ //
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const postSchema = new mongoose.Schema({
  title: { type: String },
  content: { type: String }
});

const Post = mongoose.model("Post", postSchema);

// ------------ SERVER ------------ //
const app = express();

// Use lodash in ejs files:
app.locals._ = _;

// Server config
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Routes
// Home Page
app.get("/", (req, res) => {
  // Fetch all posts in Posts collections
  Post.find({}, (err, result) => {
    if (err) { 
      console.log("err-find", err.message, err.stack)
    } else {
      res.render("home", { startingContent: homeStartingContent, posts: result });
    }
  });
});

// About Page
app.get("/about", (req, res) => {
  res.render("about", {startingContent: aboutContent});
});

// Contact Page
app.get("/contact", (req, res) => {
  res.render("contact", {startingContent: contactContent});
});

// Compose Page
app.get("/compose", (req, res) => {
    res.render("compose");
});

app.post("/compose", (req, res) => {
    const post = new Post({
      title: req.body.postTitle,
      content: req.body.postBody
    });
    post.save();
    res.redirect("/");
});

// Show Single Post Page -> posts/:postName
app.get("/posts/:postName", (req, res) => {
  const requestedTitle = req.params.postName;
  Post.findOne( {title: requestedTitle}, (err, result) => {
    if (err) {
      console.log("err", err.message, err.stack);
    } else { 
      if (result === null) {
        res.render("post", {
          postTitle: "Error! Post not found.",
          postContent: "No content to render.."
        });
      } else {
        res.render("post", {
          postTitle: result.title,
          postContent: result.content
          });
      }
    }
  });
});

// Delete Single Post Page -> delete/:postName
app.post("/delete/:postName", (req, res) => {
  const requestedTitle = req.body.deleteFile;
  console.log("requestedTitle: " + requestedTitle);
  Post.deleteOne({ title: requestedTitle }, (err, result) => {
    if (err) {
      console.log("err", err.message, err.stack);
    } else {
      if (result === null) {
        console.log("post not found...");
      } else {
        console.log(result);
      }
    }
  });
  res.redirect("/");
});

// Server connection
app.listen(3000, () => { console.log("server running on port 3000"); });

