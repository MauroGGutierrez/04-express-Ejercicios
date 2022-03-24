// const bodyParser = require("body-parser");
const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];

const server = express();
// to enable parsing of json bodies for post requests
server.use(express.json());

//function closure --> primera opcion
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
  const { author } = req.params;
  const { title, contents } = req.body;
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

// ----------GET-------------

const filter = (data) => {
  return posts.filter((e) => e.contents == data || e.title == data);
};

server.get("/posts/", (req, res) => {
  let { term } = req.query;
  if (term) {
    const filters = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(term.toLowerCase()) ||
        post.contents.toLowerCase().includes(term.toLowerCase())
    );
    return res.send(filters);
  }
  return res.send(posts);
});

server.get("/posts/:author", (req, res) => {
  const { author } = req.params;
  const filters = posts.filter((post) => post.author === author);
  if (filters.length > 0) {
    return res.send(filters);
  }
  return res.status(STATUS_USER_ERROR).json({
    error: "No existe ningun post del autor indicado",
  });
});

server.get("/posts/:author/:title", (req, res) => {
  // const thisAuthor = req.params.author;
  // const thisTitle = req.params.title;
  // if (!posts.some((e) => e.author === thisAuthor && e.title === thisTitle)) {
  //   return res.status(STATUS_USER_ERROR).json({
  //     error: "No existe ningun post con dicho titulo y autor indicado",
  //   });
  // } else {
  //   const filterAuthor = posts.filter(
  //     (e) => e.author === thisAuthor && e.title === thisTitle
  //   );
  //   return res.status(200).send(filterAuthor);
  // }
  const { author, title } = req.params;
  const filters = posts.filter(
    (post) => post.author === author && post.title === title
  );
  if (filters.length > 0) {
    return res.send(filters);
  }
  return res.status(STATUS_USER_ERROR).json({
    error: "No existe ningun post con dicho titulo y autor indicado",
  });
});

server.put("/posts", (req, res) => {
  const { id, title, contents } = req.body;
  if (!title || !id || !contents) {
    return res.status(STATUS_USER_ERROR).json({
      error:
        "No se recibieron los parámetros necesarios para modificar el post",
    });
  }
  //comprobar si el id existe en posts
  let indexPost = null;
  const postExist = posts.find((post, index) => {
    if (post.id === id) {
      indexPost = index;
      return post;
    }
  });
  if (postExist) {
    postExist.contents = contents;
    postExist.title = title;
    posts[indexPost] = postExist;
    return res.send(postExist);
  }
  return res.status(STATUS_USER_ERROR).json({
    error: "El id enviado no es valido",
  });
});

server.delete("/posts", (req, res) => {
  const { id } = req.body;
  if (id) {
    let indexPost = null;
    const postExist = posts.find((post, index) => {
      if (post.id === id) {
        indexPost = index;
        return post;
      }
    });
    if (postExist) {
      posts.splice(indexPost, 1);
      return res.json({ success: true });
    }
    return res.status(STATUS_USER_ERROR).json({ error: "El id es invalido" });
  }
  return res.status(STATUS_USER_ERROR).json({ error: "No se envio el id" });
});

server.delete("/author", (req, res) => {
  const { author } = req.body;
  if (author) {
    const indexPosts = [];
    const postsExist = posts.filter((post, index) => {
      if (post.author === author) {
        indexPost.push(index);
        return post;
      }
    });
    if (indexPosts.length > 0) {
      for (let i = 0; i < indexPosts.length; i++) {
        posts.splice(i, 1);
      }
      return res.json(postsExist);
    }
    return res
      .status(STATUS_USER_ERROR)
      .json({ error: "No existe el autor indicado" });
  }
  return res.status(STATUS_USER_ERROR).json({ error: "No se envio el author" });
});

module.exports = { posts, server };
