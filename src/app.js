const { server } = require("./server.js");
const express = require("express");
const app = express();

const myPost = require("./posts.json");

server.get("/", (req, res) => {
  res.send("Hola mundo!");
});

server.listen(3000, () => {
  console.log(`server iniciado`);
});
