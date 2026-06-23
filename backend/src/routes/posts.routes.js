import express from "express";
import postController from "../controllers/posts.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const Router = express.Router();

Router.post("/create", authMiddleware.checkUserlogin, postController.createPost);
Router.put("/update/:id", authMiddleware.checkUserlogin, postController.updatePost);
Router.get("/allPosts", authMiddleware.checkUserlogin, postController.getAllPosts);
Router.get("/viewPost/:postId", authMiddleware.checkUserlogin, postController.getPostById);

export default Router;