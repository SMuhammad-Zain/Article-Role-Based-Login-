import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import postsRoutes from "./routes/posts.routes.js";

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

export default app;