import mongoose from "mongoose";

const postsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    writer: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref : "Users"
    },
    opened: {
        type: Number,
        default: 0
    }
}, {timestamps:true});

const postsModel = mongoose.model("posts", postsSchema);

export default postsModel;