// const bodyParser = require("body-parser");
const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
const posts = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

//function closure
function generateId() {
  let id = 1;
  function increment() {
    return id++;
  }
  return increment;
}

const getId = generateId();

// TODO: your code to handle requests
server.post("/posts", (req, res) => {
  const { author, title, contents } = req.body;
  if (!author || !title || !contents) {
    return res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parametros necesarios para crear el Post",
    });
  }
  const newPost = {
    id: getId(),
    author,
    title,
    contents,
  };
  posts.push(newPost);
  return res.json(newPost);
});

server.post("/posts/author/:author", (req, res) => {
  const { author, title, contents } = req.body;
  if (!title || !contents) {
    return res.status(STATUS_USER_ERROR).json({
      error: "No se recibieron los parametros necesarios para crear el Post",
    });
  }
  const newPost = {
    id: getId(),
    author: req.params.author,
    title,
    contents,
  };
  posts.push(newPost);
  return res.json(newPost);
});

const filter = (data) => {
  return posts.filter((e) => e.contents == data || e.title == data);
};

server.get("/posts/", (req, res) => {
  const term = req.query.term;
  console.log(term);
  if (posts.some((e) => e.title === term || e.contents === term)) {
    return res.status(200).send(filter(term));
  }
  return res.status(200).send(posts);
  // res.send(200, { posts }); // o usar res.send
});

server.get("/posts/:author", (req, res) => {
  const thisAuthor = req.query.author;
  const newArray = posts.filter((post) => post.author === thisAuthor);
  return res.send(newArray);
  // if (post.some((e) => e.author === thisAuthor)) {
  //   return res.status(200).send(filter(thisAuthor));
  // }
});

module.exports = { posts, server };
