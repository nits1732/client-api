const express=require("express")
const router=express.Router()
const {verifyRefreshJWT,createRefreshJWT}=require("../helpers/jwt.helper") 
const {getUserByEmail} = require ("../model/user/user.model")

router.get("/",async(req, res,next)=>{
    const {authorization}=req.headers

    // todos
    // 1. Token is valid or not
    const decoded= await verifyRefreshJWT(authorization)
    if(decoded.email){
        // 2. checking if the jwt is present or not in the database
        const userProf=await getUserByEmail(decoded.email)
        if(userProf._id){
            let tokenExp = new Date(userProf.refreshJWT.addedAt);
            const dBrefreshToken = userProf.refreshJWT.token;
            tokenExp= tokenExp.setDate(tokenExp.getDate() + +process.env.JWT_REFRESH_SECRET_EXP_DAY);

            const today=new Date();
            //3. check if it not expired
            if (dBrefreshToken!=authorization &&  tokenExp<today){
                return res.status(403).json({message:"Forbidden"})
            }
            const accessJWT= await createRefreshJWT(decoded.email, userProf._id.toString())
                return res.json({status:"success",accessJWT})
        
        }
    }
    
    res.status(403).json({message: "Forbidden"})
})
module.exports=router;