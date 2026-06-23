import jwt from "jsonwebtoken";

async function checkUserlogin(req, res, next) {
    const token = req.cookies.token;

    //check if token is present
    if (!token) {
        return res.status(401).json({
            message: "Invalid token"
        });
    };

    //validate token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        req.login = true;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};

export default { checkUserlogin };