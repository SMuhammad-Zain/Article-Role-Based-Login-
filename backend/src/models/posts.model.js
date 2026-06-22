const mongoose = require("mongoose");

postsSchema = new mongoose.Schema({
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

postsModel = mongoose.model("posts", postsSchema);

module.exports = postsModel;