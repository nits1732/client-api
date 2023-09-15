const express=require("express")
const router=express.Router()
const {route}=require("./ticket.router")
const {insertUser} = require("../model/user/user.model")
const {hashPassword}= require("../helpers/bcrypt.helper")

router.all('/',(req, res,next)=>{
    // console.log(name)
    // res.json({message:"Return from User Router"})
    next();
})
//create the user account
router.post('/',async(req,res)=>{
    const {name,phone,company,address,email,password}=req.body;
    try{
//hash password
        const hashedPass= await hashPassword(password)
        const newUserObj={
            name,phone,company,address,email,
            password:hashedPass,
        }
        const result = await insertUser(newUserObj)
        console.log(result)
        res.json({message:"New user Created",result})
    }catch(error){
        console.log(error)
        res.json({status:'error' , messgae:error.message})
    }
})
module.exports=router;