const postsModel = require("../models/posts.model")

async function createPost(req, res) {
    //getting token from request
   const token = req.cookies.token;

};

module.exports = { createPost };