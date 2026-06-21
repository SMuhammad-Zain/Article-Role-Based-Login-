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

async function loginUser(req, res) {
  const { username, email, password } = req.body;

  //finding user by email or password
  user = await usersModel.findOne({
    $or:[
        { username },
        { email }
    ]
  });

  //response for incorrect email or password
  if (!user){
    return res.status(401).json({
        "message":"Invalid email\\username"
    });
  }

  //checking if the password is correct
  validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword){
    return res.status(401).json({
        "message": "Incorrect Password"
    });
  };

  //creating token for correct user
  token = jwt.sign({
    id: user._id,
    role: user.role
  }, process.env.JWT_SECRET);

  //sending cookies in response
  res.cookie("token", token)
  //sending loging in response
  res.status(200).json({
    "id": user._id,
    "username": user.username,
    "email": user.email,
    "password": user.password,
    "role": user.role
  });
};

module.exports = { signupUser, loginUser }