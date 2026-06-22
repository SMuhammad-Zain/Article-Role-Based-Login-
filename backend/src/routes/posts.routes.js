const express = require("express");
const postController = require("../controllers/posts.controller")
const authMiddleware = require("../middlewares/auth.middleware")

Router = express.Router();

Router.post("/create", authMiddleware.checkUserlogin, postController.createPost);
Router.put("/update/:id", authMiddleware.checkUserlogin, postController.updatePost);
Router.get("/allPosts", authMiddleware.checkUserlogin, postController.getAllPosts);
Router.get("/viewPost/:postId", authMiddleware.checkUserlogin, postController.getPostById);

module.exports = Router;