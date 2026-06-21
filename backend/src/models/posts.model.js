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
        required: true
    }
}, {timestamp:true});

postsModel = mongoose.model("posts", postsSchema);

module.exports = postsModel;