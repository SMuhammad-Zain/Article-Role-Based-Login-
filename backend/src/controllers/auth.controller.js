import crypto from "crypto";
import jwt from "jsonwebtoken";
import usersModel from "../models/user.models.js";
import config from "../config/config.js";
import sessionsModel from "../models/sessions.model.js";

export async function signupUser(req, res) {
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
    const hash = await crypto.createHash("sha256").update(password).digest("hex");

    //creating the document for user
    const user = await usersModel.create({
        username,
        email, 
        "password":hash,
        role
    })

    const refreshToken = jwt.sign({
        id: user._id,
        role: user.role
    }, config.JWT_SECRET,{
        "expiresIn": '1d'
    });

    const hashRefreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionsModel.create({
        userId: user._id,
        refreshTokenHash: hashRefreshToken,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    });

    
    //creating access token for the user
    const accessToken = jwt.sign({
        sessionId: session._id,
        id: user._id,
        role: user.role
    }, config.JWT_SECRET,{
        'expiresIn': '5m'
    });
    
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
    })

    // const token = jwt.sign({
    //     id: user._id,
    //     role: role
    // }, process.env.JWT_SECRET);
    
    // //saving token in the cookies
    // res.cookie("token",token)

   res.status(201).json({
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    accessToken: accessToken
   });
};

export async function loginUser(req, res) {
  const { username, email, password } = req.body;

  //finding user by email or password
  const user = await usersModel.findOne({
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
  const validPassword = crypto.createHash("sha256").update(password).digest("hex") === user.password;
  if (!validPassword){
    return res.status(401).json({
        "message": "Incorrect Password"
    });
  };

  //creating token for correct user
  const refreshToken = jwt.sign({
    id: user._id,
    role: user.role
  }, process.env.JWT_SECRET,{
    "expiresIn": "1d"
  });

  //sending cookies in response
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000
  });

  const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

  const session = await sessionsModel.create({
    userId: user._id,
    refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"]
  });

  const accessToken = jwt.sign({
    sessionId: session._id,
    id: user._id,
    role: user.role
  }, config.JWT_SECRET, {
    "expiresIn": "5m"
  });

  //sending loging in response
  res.status(200).json({
    id: user._id,
    username: user.username,
    email: user.email,
    password: user.password,
    role: user.role,
    token: accessToken
  });
};

export async function refreshToken(req, res) {
    const token = req.cookies.refreshToken;

    //checking if the token is present in the cookies
    if (!token) {
        res.status(401).json({
            "message": "No refresh token found"
        });
    };

    const refreshTokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const session = await sessionsModel.findOne({
        refreshTokenHash,
        revoked: false
    });

    if (!session) {
        return res.status(401).json({
            "message": "Invalid refresh token"
        });
    };

    const decoded = jwt.verify(token, config.JWT_SECRET);
    if (!decoded) {
        res.status(401).json({
            "message": "Invalid refresh token"
        });
    }

    //new access token creation

    const newAccessToken = jwt.sign({
        sessionId: session._id,
        id: decoded.id,
        role: decoded.role
    }, config.JWT_SECRET, {
        "expiresIn": "5m"
    });

    const newRefreshToken = jwt.sign({
        id: decoded.id,
        role: decoded.role
    }, config.JWT_SECRET, {
        "expiresIn": "1d"   
    });

    const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");

    session.refreshTokenHash = newRefreshTokenHash;
    await session.save();

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
        message: "Access token refreshed successfully",
        token: newAccessToken
    })


};

export async function logoutUser(req, res) {
    const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(400).json({
            "message": "No refresh token found"
        });
    };

    const refreshTokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const session = await sessionsModel.findOne({
        refreshTokenHash,
        revoked: false
    });

    if (!session) {
        return res.status(400).json({
            "message": "Invalid refresh token"
        });
    };

    session.revoked = true;
    await session.save();

    res.clearCookie("refreshToken");
    res.status(200).json({
        "message": "Logged out successfully"
    }); 
}