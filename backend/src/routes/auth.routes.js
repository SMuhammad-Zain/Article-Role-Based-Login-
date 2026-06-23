import express from "express";
import * as authController from "../controllers/auth.controller.js";

const Router = express.Router();

Router.post("/signup", authController.signupUser);
Router.post("/login", authController.loginUser);
Router.get("/refresh", authController.refreshToken);
Router.get("/logout", authController.logoutUser);

export default Router;