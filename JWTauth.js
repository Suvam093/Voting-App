const jwt = require('jsonwebtoken')

//JWT auth Middleware
const JWTauthMiddleware = (req, res, next) => {

    const authorization = req.headers.authorization;
    if(!authorization){
        return res.status(401).json({message: "Token not found"});
    }

    const token = req.headers.authorization.split(" ")[1];
    if(!token){
        return res.status(401).json({message: "Unauthorized"});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: "token not found"});
    }
}

const generateToken = (userData) =>{
    return jwt.sign(userData, process.env.JWT_SECRET);
}

module.exports = {JWTauthMiddleware, generateToken};