const {verifyAccessJWT}= require("../helpers/jwt.helper");
const { getJWT, deleteJWT } = require("../helpers/redis.helper");
const userAuthorization = async (req, res, next) => {
    const { authorization } = req.headers; 
//steps to do authorization
    const decoded=await verifyAccessJWT(authorization)
    if(decoded.email){
        const userId=await getJWT(authorization)
        console.log(userId);
        if(!userId){
            res.status(403).json({ message: "Forbidden" });
        }
        req.userId=userId
        return next();
    }
    deleteJWT(authorization)
    return res.status(403).json({ message: "Forbidden" });
//verfiy whether it is the valid jwt 
// check if the jwt exist in the redis
//extract the user id
// get the user profile based on user id
}

module.exports = {
    userAuthorization
}
