const express = require("express");
const authController = require("../controllers/auth.controller")

const Router = express.Router();

Router.post("/signup", authController.signupUser);
Router.post("/login", authController.loginUser);

module.exports = Router;