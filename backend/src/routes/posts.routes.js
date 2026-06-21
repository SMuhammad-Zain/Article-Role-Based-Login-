const express = require("express");
const postController = require("../controllers/posts.controller")

Router = express.Router();

Router.post("/create", postController.createPost)

module.exports = Router;