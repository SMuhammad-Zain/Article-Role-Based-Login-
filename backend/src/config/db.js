import mongoose from "mongoose";
import config from "./config.js";

async function connectDB() {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("Server connected to database");
    } catch (error) {
        console.error("Database connection error", error);
        
    };
};

export default connectDB;