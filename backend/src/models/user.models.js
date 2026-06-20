const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email : {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    role : {
        type: String,
        enum: [ 'viewer', 'writer'],
        default: 'viewer'
    }
});

const usersModel = mongoose.model("Users", userSchema);
module.exports = usersModel;