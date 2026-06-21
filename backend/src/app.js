const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes");
const postsRoutes = require("./routes/posts.routes")

const app = express();

//middlewares
//using json for request body
app.use(express.json());
//using browser cookies
app.use(cookieParser());
//logging each request
app.use((req, res, next) => {
    console.log(`${req.method} HTTP ${req.httpVersion} ${req.url}`);
    next();
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);

module.exports = app;