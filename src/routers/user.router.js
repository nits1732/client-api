const express=require("express")
const router=express.Router()
const {route, notify}=require("./ticket.router")
const {insertUser, getUserByEmail, getUserById, updatePassword} = require("../model/user/user.model")
const {hashPassword, comparePassword}= require("../helpers/bcrypt.helper")
const {createAccessJWT, createRefreshJWT}= require("../helpers/jwt.helper")
const {userAuthorization} = require("../middlewares/authorization.middlewares")
const {setPasswordResetPin, getPinByEmailPin, deletePin} = require("../model/ResetPin/ResetPin.model")
const { emailProcesser } = require("../helpers/email.helper")
const { resetPassReqValidation, updatePassValidation } = require("../middlewares/formValidation.middleware")
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

// Process to reset the password
// A. create and send password reset pin Number
// 1. recieve email
// 2. check if the user exist or not
// 3. create a unique 6 digit pin 
// 4. email the pin

// B. Update Password in the db 
// 1. recieve email, pin, new password
// 2. validate the pin
// 3. encrypt the new password
// 4. update the password in the db
// 5. send email notifation that password is updated
 
// C. Server side for validation
// 1. create middleware to validate from data

// router.post("/reset-password", async (req, res)=>{
//     const {email} = req.body;
//     const user= await getUserByEmail(email)
//     if(user && user._id){
//         const setPin= await setPasswordResetPin(email)
//         res.json(setPin);
//         // res.json(user)
//     }
//     res.json({status:"error", message:"If the email Exist , the password reset pin will be send sortly"});
// })
router.post("/reset-password", resetPassReqValidation, async (req, res) => {
    const { email } = req.body;
    // Early exit if email is not provided
    if (!email) {
        return res.status(400).json({ status: "error", message: "Email is required" });
    }

    try {
        const user = await getUserByEmail(email);
        // If no user is found, return an error message.
        // Note: For security reasons, you might want to obscure whether the email exists or not.
        if (!user || !user._id) {
            return res.status(404).json({ status: "error", message: "If the email exists, the password reset pin will be sent shortly" });
        }

        // User exists, create and send the reset pin.
        const setPin = await setPasswordResetPin(email);
        await emailProcesser({email, pin: setPin.pin, type: 'request-new-password'});
        //delete the pin from the db
        return res.json({
            status:"success",
            message:"Send Successfully"
        })
    } catch (error) {
        console.error('Error in /reset-password route:', error);
        return res.status(500).json({ status: "error", message: "If email exist, Your Reset pin will be send  soon." });
    }
});


router.patch("/reset-password",updatePassValidation, async(req,res)=>{
    const {email, pin, newPassword}=req.body;
    const getPin= await getPinByEmailPin(email,pin)
    if(getPin._id){
        const dbDate=getPin.addedAt;
        const expireIn=1;
        let expDate=dbDate.setDate(dbDate.getDate()+expireIn);
        const today = new Date();
        if(today>expDate){
            return res.json({status:"error", message:"Invalid or expired pin"})
        }

        //encrypt the new password
        const hashedPass=await hashPassword(newPassword);
        const user=await updatePassword(email,hashedPass)
        if(user._id){
            await emailProcesser({email, type: 'update-password-success'});
            deletePin(email,pin);
            return res.json({status:"success", message:"Password has been updated"})
        }
    }
    res.json({status:"error", message:"Unable to update the password"});
})
module.exports=router;