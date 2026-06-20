const usersModel = require("../models/user.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function signupUser(req, res) {
    //storing the recieved data 
    const { username, email, password, role = "viewer" } = req.body;
    //checking for redundant username or emails
    const userExists = await usersModel.findOne({
        $or:[
            { username },
            { email }
        ]
    });

    if (userExists) {
        //returning from function if user exists
        return res.status(409).json(
            {"message":"User already exists"});
    };

    //creating hash value for password
    hash = await bcrypt.hash(password, 10);

    //creating the document for user
    user = await usersModel.create({
        username,
        email, 
        "password":hash,
        role
    })

    //creating token for the user
    token = jwt.sign({
        id: user._id,
        role: role
    }, process.env.JWT_SECRET);
    
    //saving token in the cookies
    res.cookie("token",token)

    res.status(200).json({
        "username": user.username,
        "email": user.email,
        "password":user.password,
        "role":user.role
    })
};

module.exports = { signupUser }