import jwt from "jsonwebtoken";
import sessionsModel from "../models/sessions.model.js";
import config from "../config/config.js";
import crypto from 'crypto'
import { decode } from "punycode";

async function checkUserlogin(req, res, next) {
    const token = req.headers["authorization"].split(" ")[1]
    console.log(token);
    const refreshToken = req.cookies.refreshToken;

    //check if tokens are present
    if (!token || !refreshToken){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
    

    //validate present tokens

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET)
        if (decoded.refresh !== refreshToken){
            return res.status(401).json({
            message:"Unauthorized"
        })
        }
        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest('hex')
        const sessionId = decoded.sessionId
        const session = await sessionsModel.findOne({
            _id: sessionId,
            refreshTokenHash: refreshTokenHash,
            revoked: false
        })
        if (!session){
            return res.status(401).json({
                message: "invalid Token"
            })
        }
        req.user = decoded
        req.login = true
        next();

    } catch(err){
        return res.status(401).json({
            message:"Invalid Token"
        })
    }
    
}

export default { checkUserlogin };