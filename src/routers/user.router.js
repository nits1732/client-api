const express=require("express")
const router=express.Router()
const {route}=require("./ticket.router")
const {insertUser, getUserByEmail} = require("../model/user/user.model")
const {hashPassword, comparePassword}= require("../helpers/bcrypt.helper")

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

router.post("/login",async (req,res)=>{
    console.log(req.body)
    const {email,password}= req.body

    // get user with email from database
    //hash our pass and compare with the dp

    if(!email || !password){
        return res.json({status:"error", message:"Invaild Form Submission!"})    
    }
    const user= await getUserByEmail(email)
    console.log(user)

    const passFromDb=user && user._id ? user.password : null;
    if(!passFromDb)return res.json({status:"error", message:"Invaild Email or Password!"})

    const result= await comparePassword(password,passFromDb)
    console.log(result)

    res.json({status:"Success", message:"Login Success !"})
})


module.exports=router;