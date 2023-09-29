const express=require("express")
const router=express.Router()
const {route}=require("./ticket.router")
const {insertUser, getUserByEmail, getUserById} = require("../model/user/user.model")
const {hashPassword, comparePassword}= require("../helpers/bcrypt.helper")
const {createAccessJWT, createRefreshJWT}= require("../helpers/jwt.helper")
const {userAuthorization} = require("../middlewares/authorization.middlewares")
router.all("/",(req, res,next)=>{
    // console.log(name)
    // res.json({message:"Return from User Router"})
    next();
})

//Get user profile router
router.get("/",userAuthorization ,async (req, res)=>{
    // this is comming from database-->assumption
    const _id= req.userId
    const userProf=await getUserById(_id)
    res.json({user : userProf})
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
    if(!result){
        return res.json({status:"error", message:"Invaild Email or Password!"})
    }
    console.log(result)
    const accessJWT= await createAccessJWT(user.email,`${user._id}`)
    const refreshJWT= await createRefreshJWT(user.email, `${user._id}`)
    res.json({status:"Success", message:"Login Success !", accessJWT, refreshJWT})
})


module.exports=router;