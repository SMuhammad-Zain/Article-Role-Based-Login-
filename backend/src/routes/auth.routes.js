const express = require("express");
const authController = require("../controllers/auth.controller")

const Router = express.Router();

Router.post("/signup", authController.signupUser);

module.exports = Router;